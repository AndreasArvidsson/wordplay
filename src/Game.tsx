import type { JSX } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { classNames } from "./classNames";
import { shuffleList } from "./shuffleList";
import type { Letter, Word } from "./types";

interface Props {
    letters: Letter[];
    words: Word[];
    exitGame: () => void;
}

interface SolvedWord {
    word: Word;
    isSolved: boolean;
    isGivenUp: boolean;
}

export function Game({ letters, words, exitGame }: Props): JSX.Element {
    const [shuffledLetters, setShuffledLetters] = useState(letters);
    const [selectedLetters, setSelectedLetters] = useState(
        getDefaultSelected(letters.length),
    );
    const [lastSubmission, setLastSubmission] = useState<(Letter | null)[]>();
    const [solvedWords, setSolvedWords] = useState<SolvedWord[]>(
        words.map((word) => ({
            word,
            isSolved: false,
            isGivenUp: false,
        })),
    );
    const isDone = solvedWords.every((sw) => sw.isSolved || sw.isGivenUp);
    const numSelectedLetters = selectedLetters.filter((s) => s != null).length;

    const selectLetter = (letter: Letter) => {
        const copy = selectedLetters.slice();
        const nextAvailableIndex = selectedLetters.findIndex((i) => i == null);
        copy[nextAvailableIndex] = letter;
        setSelectedLetters(copy);
    };

    const deselectLetter = (letter: Letter) => {
        const copy = selectedLetters.slice();
        const index = copy.findIndex((i) => i?.id === letter.id);
        copy[index] = null;
        setSelectedLetters(copy);
    };

    const resetSelectedLetters = () => {
        setSelectedLetters(getDefaultSelected(letters.length));
    };

    const useLastSubmission = () => {
        if (lastSubmission != null) {
            setSelectedLetters(lastSubmission);
        }
    };

    const shuffleLetters = () => {
        const copy = shuffleList(letters);
        setShuffledLetters(copy);
    };

    const submitSelectedLetters = () => {
        const word = selectedLetters
            .map((s) => s?.letter ?? "")
            .join("")
            .toLowerCase();
        const foundWord = solvedWords.find((sw) => sw.word.word === word);

        if (foundWord) {
            foundWord.isSolved = true;
            setSolvedWords(solvedWords.slice());
        }

        setLastSubmission(selectedLetters);
        resetSelectedLetters();
    };

    const giveUp = () => {
        setSolvedWords(
            solvedWords.map((sw) =>
                sw.isSolved ? sw : { ...sw, isGivenUp: !sw.isSolved },
            ),
        );
        resetSelectedLetters();
    };

    useLayoutEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                isDone ||
                event.defaultPrevented ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey ||
                event.isComposing ||
                (event.target instanceof HTMLElement &&
                    (event.target.isContentEditable ||
                        event.target.closest("input, textarea, select") !=
                            null))
            ) {
                return;
            }

            switch (event.key) {
                case "Enter":
                    event.preventDefault();
                    if (numSelectedLetters >= 3) {
                        submitSelectedLetters();
                    }
                    break;
                case "Backspace": {
                    event.preventDefault();
                    const lastLetter = selectedLetters.findLast(
                        (letter) => letter != null,
                    );
                    if (lastLetter != null) {
                        deselectLetter(lastLetter);
                    }
                    break;
                }
                case "Escape":
                    event.preventDefault();
                    resetSelectedLetters();
                    break;
                default: {
                    const letter = shuffledLetters.find(
                        (l) =>
                            l.letter === event.key.toUpperCase() &&
                            !selectedLetters.some(
                                (selected) => selected?.id === l.id,
                            ),
                    );
                    if (letter != null) {
                        event.preventDefault();
                        selectLetter(letter);
                    }
                }
            }
        };

        globalThis.addEventListener("keydown", handleKeyDown);
        return () => globalThis.removeEventListener("keydown", handleKeyDown);
    });

    const renderWords = () => {
        const columnCount = 5;
        const rowCount = Math.ceil(solvedWords.length / columnCount);

        return (
            <div className="game-words">
                <table>
                    <tbody>
                        {Array.from({ length: rowCount }, (_r, row) => (
                            <tr key={row}>
                                {Array.from(
                                    { length: columnCount },
                                    (_c, column) => {
                                        const index = column * rowCount + row;

                                        if (index > solvedWords.length - 1) {
                                            return <td key={column} />;
                                        }

                                        const word = solvedWords[index];

                                        return (
                                            <td key={column}>
                                                {renderWord(word)}
                                            </td>
                                        );
                                    },
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderSelected = () => {
        return (
            <div>
                {selectedLetters.map((letter, index) => (
                    <span key={index} className="selected-letter-wrapper">
                        <button
                            type="button"
                            className="btn btn-lg btn-outline-secondary btn-letter-selected"
                            disabled={isDone || letter == null}
                            onClick={
                                letter == null
                                    ? undefined
                                    : () => deselectLetter(letter)
                            }
                        >
                            {letter?.letter}
                        </button>
                    </span>
                ))}
            </div>
        );
    };

    const renderAvailable = () => {
        return (
            <div className="mt-3">
                {shuffledLetters.map((letter) => (
                    <button
                        key={letter.id}
                        type="button"
                        className="btn btn-lg btn-outline-secondary btn-letter-available"
                        disabled={
                            isDone ||
                            selectedLetters.some((s) => s?.id === letter.id)
                        }
                        onClick={() => selectLetter(letter)}
                    >
                        {letter.letter}
                    </button>
                ))}
            </div>
        );
    };

    const renderButtons = () => {
        return (
            <div className="mt-4 game-buttons">
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isDone}
                    onClick={shuffleLetters}
                >
                    Shuffle
                </button>
                <button
                    type="button"
                    className="btn btn-primary ms-3"
                    disabled={isDone || lastSubmission == null}
                    onClick={useLastSubmission}
                >
                    Last
                </button>
                <button
                    type="button"
                    className="btn btn-primary ms-3 float-end"
                    disabled={isDone || numSelectedLetters < 3}
                    onClick={submitSelectedLetters}
                >
                    Enter
                </button>
                <button
                    type="button"
                    className="btn btn-primary float-end"
                    disabled={isDone}
                    onClick={resetSelectedLetters}
                >
                    Clear
                </button>
            </div>
        );
    };

    const renderGiveUpButton = () => {
        if (isDone) {
            return (
                <div className="mt-5 game-buttons">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={exitGame}
                    >
                        Exit
                    </button>
                </div>
            );
        }

        return (
            <div className="mt-5 game-buttons">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={giveUp}
                >
                    Give up
                </button>
            </div>
        );
    };

    return (
        <div className="text-center">
            {renderWords()}
            {renderSelected()}
            {renderAvailable()}
            {renderButtons()}
            {renderGiveUpButton()}
        </div>
    );
}

function getDefaultSelected(length: number): (Letter | null)[] {
    return Array.from({ length }, () => null);
}

function renderWord(word: SolvedWord): JSX.Element[] {
    const letters = word.word.word.split("");
    return letters.map((letter, index) => (
        <span
            key={index}
            className={classNames("word-letter", word.isGivenUp && "given-up")}
        >
            {word.isSolved || word.isGivenUp ? letter.toUpperCase() : undefined}
        </span>
    ));
}
