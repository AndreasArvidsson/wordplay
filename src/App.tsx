import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Button } from "./components/Button";
import { Game } from "./Game.js";
import type { Letter, Word } from "./types";
import { findWords } from "./util/findWords";
import { generateLetters } from "./util/generateLetters";
import { readVocabulary } from "./util/readVocabulary";

interface GameContext {
    letters: Letter[];
    words: Word[];
}

export function App(): JSX.Element {
    const [numLetters, setNumLetters] = useState(6);
    const [gameContext, setGameContext] = useState<GameContext>();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        readVocabulary().catch((error: unknown) => {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to preload vocabulary.",
            );
        });
    }, []);

    const exitGame = () => {
        setGameContext(undefined);
    };

    if (gameContext != null) {
        return (
            <Game
                letters={gameContext.letters}
                words={gameContext.words}
                exitGame={exitGame}
            />
        );
    }

    const generateGameContext = async () => {
        setErrorMessage(undefined);
        const vocabulary = await readVocabulary();
        const letters = generateLetters(numLetters, vocabulary);
        const words = findWords(letters, vocabulary);
        const lettersWithId = letters.map((letter, index) => ({
            id: `${letter}${index}`,
            letter,
        }));
        setGameContext({ letters: lettersWithId, words });
    };

    return (
        <>
            <h1>Wordplay</h1>

            <table>
                <tbody>
                    <tr>
                        <td className="pe-3">Number of letters</td>
                        <td>
                            <input
                                type="number"
                                min={3}
                                step={1}
                                className="form-control"
                                value={numLetters}
                                onChange={(e) =>
                                    setNumLetters(Number(e.currentTarget.value))
                                }
                            />
                        </td>
                    </tr>

                    <tr>
                        <td />
                        <td>
                            <Button
                                variant="btn-primary"
                                className="mt-3"
                                onClick={() => {
                                    generateGameContext().catch(
                                        (error: unknown) => {
                                            setErrorMessage(
                                                error instanceof Error
                                                    ? error.message
                                                    : "Could not start a game. Please try again.",
                                            );
                                        },
                                    );
                                }}
                            >
                                Start
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>

            {errorMessage != null && (
                <p className="text-danger mt-3" role="alert">
                    {errorMessage}
                </p>
            )}
        </>
    );
}
