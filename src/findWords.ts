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

    return vocabulary.filter(({ word, familiarityScore }) => {
        if (word.length < 3 || word.length > letters.length) {
            return false;
        }

        if (!includeUnfamiliar && familiarityScore < 0.5) {
            return false;
        }

        // Each candidate starts with the full set of available letters.
        const remainingLetters = new Map(letterCounts);

        for (const letter of word.toLowerCase()) {
            const count = remainingLetters.get(letter) ?? 0;

            if (count === 0) {
                return false;
            }

            remainingLetters.set(letter, count - 1);
        }

        return true;
    });
}
