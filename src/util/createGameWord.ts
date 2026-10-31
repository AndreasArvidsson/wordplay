import type { GameWord, Word } from "../types";

export function createGameWord(word: Word): GameWord {
    return {
        word,
        isSolved: false,
        isGivenUp: false,
        numCluesUsed: 0,
        clues: [
            ...(word.clues ?? []),
            `First letter is '${word.text[0].toUpperCase()}'`,
        ],
    };
}
