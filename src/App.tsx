import type { JSX } from "preact";
import { useState } from "preact/hooks";
import vocabulary from "../assets/vocabulary.json";
import { findWords } from "./findWords";
import { Game } from "./Game.js";
import { generateLetters } from "./generateLetters.js";
import type { GameContext } from "./types.js";

export function App(): JSX.Element {
    const [numLetters, setNumLetters] = useState(9);
    const [includeUnfamiliarWords, setIncludeUnfamiliarWords] = useState(false);
    const [gameContext, setGameContext] = useState<GameContext>();

    if (gameContext != null) {
        return <Game context={gameContext} />;
    }

    const generateGameContext = () => {
        const letters = generateLetters(numLetters);
        const words = findWords(letters, includeUnfamiliarWords, vocabulary);
        setGameContext({ letters, words });
    };

    return (
        <>
            <h1>Wordplay</h1>

            <table>
                <tbody>
                    <tr>
                        <td>Number of letters</td>
                        <td>
                            <input
                                type="number"
                                className="form-control"
                                value={numLetters}
                                onChange={(e) =>
                                    setNumLetters(Number(e.currentTarget.value))
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="pe-3">Include unfamiliar words</td>
                        <td>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={includeUnfamiliarWords}
                                onChange={(e) =>
                                    setIncludeUnfamiliarWords(
                                        e.currentTarget.checked,
                                    )
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td />
                        <td>
                            <button
                                type="button"
                                className="btn btn-primary mt-3"
                                onClick={generateGameContext}
                            >
                                Start
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
