import type { Word } from "./types.js";
import { allowWord } from "./util/allowWord.js";
import { shuffleList } from "./util/shuffleList.js";

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

    // Sorted by length, but shuffled within each length group
    return shuffleList(filteredWords).toSorted(
        (a, b) => a.text.length - b.text.length,
    );
}
