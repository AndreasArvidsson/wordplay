import type { Word } from "./types";
import { shuffleList } from "./util/shuffleList";

export function generateLetters(
    numLetters: number,
    vocabulary: Word[],
): string[] {
    if (!Number.isInteger(numLetters) || numLetters < 3) {
        throw new Error("Choose a whole number of letters of at least 3.");
    }

    const candidates = vocabulary.filter(
        (word) => word.text.length === numLetters,
    );

    if (candidates.length === 0) {
        throw new Error(
            `No ${numLetters}-letter words are available with the current settings.`,
        );
    }

    const index = Math.floor(Math.random() * candidates.length);
    const letters = candidates[index].text.toUpperCase().split("");

    return shuffleList(letters);
}
