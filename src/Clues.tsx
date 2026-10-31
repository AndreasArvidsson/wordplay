import type { JSX } from "preact";
import type { GameWord } from "./types";

interface Props {
    words: GameWord[];
}

export function Clues({ words }: Props): JSX.Element {
    return (
        <div className="game-clues mt-2">
            {words.map((word) => {
                const clues =
                    word.numCluesUsed > 0 && !word.isSolved && !word.isGivenUp
                        ? word.word.clues?.slice(0, word.numCluesUsed)
                        : undefined;
                if (clues == null) {
                    return null;
                }
                return (
                    <div key={word.word.text}>
                        {word.word.text.length} letters:
                        <ul>
                            {clues.map((clue, index) => (
                                <li key={index}>{clue}</li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
