export interface Word {
    word: string;
    familiarityScore: number;
    definition?: string;
}

export interface GameContext {
    letters: string[];
    words: Word[];
}
