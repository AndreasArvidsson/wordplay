import type { GameWord } from "../types";

interface Scores {
    score: number;
    maxScore: number;
    numSolved: number;
}

export function calculateGameScores(words: GameWord[]): Scores {
    let score = 0;
    let maxScore = 0;
    let numSolved = 0;

    for (const word of words) {
        const wordScore = word.word.text.length ** 2;
        maxScore += wordScore;

        if (word.isSolved) {
            numSolved++;
            const multiplier = Math.max(0.25, 1 - word.numCluesUsed * 0.15);
            score += Math.round(wordScore * multiplier);
        }
    }

    return { score, maxScore, numSolved };
}
