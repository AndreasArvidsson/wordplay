import vocabularyUrl from "../assets/vocabulary.json?url";
import type { Word } from "./types";

export async function readVocabulary(): Promise<Word[]> {
    const response = await fetch(vocabularyUrl);

    if (!response.ok) {
        throw new Error(`Failed to load vocabulary: ${response.status}`);
    }

    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion typescript/no-unsafe-type-assertion
    return response.json() as unknown as Word[];
}
