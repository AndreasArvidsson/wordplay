import type { JSX } from "preact";
import type { GameWord } from "./types";

interface Props {
    words: GameWord[];
}

export function Clues({ words }: Props): JSX.Element | null {
    const wordsWithClues = words.flatMap((word) => {
        if (word.numCluesUsed === 0 || word.isSolved || word.isGivenUp) {
            return [];
        }
        return {
            word,
            clues: word.clues.slice(0, word.numCluesUsed),
        };
    });

    if (wordsWithClues.length === 0) {
        return null;
    }

    return (
        <section className="mb-3 p-3 text-start border border-secondary rounded">
            {wordsWithClues.map(({ word, clues }) => {
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
        </section>
    );
}
