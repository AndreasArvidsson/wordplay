import type { Word } from "./types";

export function allowWord(word: Word, includeUnfamiliar: boolean): boolean {
    return includeUnfamiliar || word.familiarityScore >= 0.5;
}
