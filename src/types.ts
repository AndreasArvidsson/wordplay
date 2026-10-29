export interface Word {
    text: string;
    familiarityScore: number;
    definition?: string;
    clues?: string[];
}

export interface Letter {
    // Unique identifier for the letter instance. This allows distinguishing between multiple instances of the same letter.
    id: string;
    letter: string;
}
