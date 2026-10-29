import fs from "node:fs";
import path from "node:path";
import type { Word } from "../src/types.js";
import { readTsv } from "./readTsv.js";

const vocabularyFile = path.resolve(
    import.meta.dirname,
    "../assets/vocabulary.core.tsv.gz",
);
const definitionsFile = path.resolve(
    import.meta.dirname,
    "../assets/definitions.core.tsv.gz",
);
const cluesFile = path.resolve(
    import.meta.dirname,
    "../assets/clues.core.tsv.gz",
);
const outputJsonFile = path.resolve(
    import.meta.dirname,
    "../assets/vocabulary.json",
);

const vocabulary = readTsv(vocabularyFile, [
    "word",
    "familiarity_score",
    "familiarity_rank",
    "in_core",
    "core_rank",
    "is_mwe",
    "n_chars",
    "n_words",
]);
const definitions = readTsv(definitionsFile, ["word", "definition"]);
const clues = readTsv(cluesFile, [
    "word",
    "clue_W1",
    "clue_W2",
    "clue_W3",
    "clue_W4",
    "clue_W5",
    "clue_SYN",
    "clue_DEF",
    "clue_CAT",
    "clue_FUN",
    "clue_ASS",
    "clue_PRO",
    "clue_CON",
    "clue_FIG",
    "clue_EX",
    "clue_ACT",
    "clue_NEG",
    "clue_SIT",
    "clue_LOC",
    "clue_SND",
    "clue_OBV",
    "clue_L1",
    "clue_L2",
    "clue_L3",
    "clue_E1",
    "clue_E2",
    "clue_E3",
]);

const words: Word[] = [];
const wordMap = new Map<string, Word>();

for await (const row of vocabulary) {
    const [
        word,
        familiarityScore,
        _familiarityRank,
        _inCore,
        _coreRank,
        isMwe,
        _nChars,
        _nWords,
    ] = row;

    // Skip multi-word expressions (MWEs)
    if (isMwe === "true") {
        continue;
    }

    // Skip words that contain characters other than lowercase letters.
    // This excludes proper nouns, acronyms, abbreviations and hyphenated words.
    if (!/^[a-z]+$/u.test(word)) {
        continue;
    }

    const wordObj: Word = {
        word,
        familiarityScore: Number(familiarityScore),
    };

    words.push(wordObj);
    wordMap.set(word, wordObj);
}

for await (const row of definitions) {
    const [word, definition] = row;
    const wordObj = wordMap.get(word);

    if (wordObj != null) {
        wordObj.definition = definition;
    }
}

// TODO: Parse clues and associate them with the corresponding words in the wordMap.

fs.writeFileSync(outputJsonFile, JSON.stringify(words, null, 4));
