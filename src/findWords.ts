import { allowWord } from "./allowWord.js";
import type { Word } from "./types.js";

export function findWords(
    letters: string[],
    includeUnfamiliar: boolean,
    vocabulary: Word[],
): Word[] {
    const letterCounts = new Map<string, number>();

    for (const letter of letters) {
        const letterNormalized = letter.toLowerCase();
        const count = letterCounts.get(letterNormalized) ?? 0;
        letterCounts.set(letterNormalized, count + 1);
    }

    const filteredWords = vocabulary.filter((word) => {
        if (word.text.length < 3 || word.text.length > letters.length) {
            return false;
        }

        if (!allowWord(word, includeUnfamiliar)) {
            return false;
        }

        // Each candidate starts with the full set of available letters.
        const remainingLetters = new Map(letterCounts);

        for (const letter of word.text.toLowerCase()) {
            const count = remainingLetters.get(letter) ?? 0;

            if (count === 0) {
                return false;
            }

            remainingLetters.set(letter, count - 1);
        }

        return true;
    });

    filteredWords.sort(
        (a, b) => a.text.length - b.text.length || a.text.localeCompare(b.text),
    );

    return filteredWords;
}
