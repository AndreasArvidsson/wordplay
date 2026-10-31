import type { JSX } from "preact";
import type { GameWord } from "./types";
import { calculateGameScores } from "./util/calculateGameScores";

interface Props {
    words: GameWord[];
}

export function GameScores({ words }: Props): JSX.Element {
    const { score, maxScore, numSolved } = calculateGameScores(words);

    return (
        <div className="mb-3">
            <div
                className="d-flex flex-wrap justify-content-center gap-2 column-gap-4 mb-1"
                role="status"
            >
                <span title="Each word earns its letter count squared in points (3 letters = 9 points).">
                    Score: <strong>{score}</strong> / {maxScore}
                </span>
                <span>
                    Words solved: <strong>{numSolved}</strong> / {words.length}
                </span>
            </div>
        </div>
    );
}
