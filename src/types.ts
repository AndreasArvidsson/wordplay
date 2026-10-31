export interface Word {
    text: string;
    definition?: string;
    clues?: string[];
}

export interface GameWord {
    word: Word;
    isSolved: boolean;
    isGivenUp: boolean;
    numCluesUsed: number;
    clues: string[];
}

export interface Letter {
    // Unique identifier for the letter instance. This allows distinguishing between multiple instances of the same letter.
    id: string;
    letter: string;
}

export type SubmissionState = "success" | "fail";
