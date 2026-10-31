import vocabularyUrl from "../../assets/vocabulary.json?url";
import type { Word } from "../types";

let vocabularyPromise: Promise<Word[]> | undefined;

export function readVocabulary(): Promise<Word[]> {
    vocabularyPromise ??= fetchVocabulary().catch((error: unknown) => {
        vocabularyPromise = undefined;
        throw error;
    });

    return vocabularyPromise;
}

async function fetchVocabulary(): Promise<Word[]> {
    const response = await fetch(vocabularyUrl);

    if (!response.ok) {
        throw new Error(`Failed to load vocabulary: ${response.status}`);
    }

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return response.json() as Promise<Word[]>;
}
