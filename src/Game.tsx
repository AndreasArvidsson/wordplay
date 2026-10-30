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
    numCluesUsed: number;
}

export function Game({ letters, words, exitGame }: Props): JSX.Element {
    const [shuffledLetters, setShuffledLetters] = useState(letters);
    const [selectedLetters, setSelectedLetters] = useState(
        getDefaultSelected(letters.length),
    );
    const [lastSubmission, setLastSubmission] = useState<(Letter | null)[]>();
    const [definitionWord, setDefinitionWord] = useState<Word>();
    const [solvedWords, setSolvedWords] = useState<SolvedWord[]>(
        words.map((word) => ({
            word,
            isSolved: false,
            isGivenUp: false,
            numCluesUsed: 0,
        })),
    );
    const isDone = solvedWords.every((sw) => sw.isSolved || sw.isGivenUp);
    const numSelectedLetters = selectedLetters.filter((s) => s != null).length;
    const longestWordLength = words.reduce(
        (length, { text: word }) => Math.max(length, word.length),
        1,
    );

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
        const foundWord = solvedWords.find((sw) => sw.word.text === word);

        if (foundWord) {
            foundWord.isSolved = true;
            setSolvedWords(solvedWords.slice());
        }

        setLastSubmission(selectedLetters);
        resetSelectedLetters();
    };

    const useClue = () => {
        // First, try to use a clue for a word that already has clues in progress.
        const cluesInProgress = solvedWords.find(
            (sw) =>
                !sw.isSolved &&
                sw.numCluesUsed > 0 &&
                sw.numCluesUsed < sw.word.text.length,
        );

        if (cluesInProgress != null) {
            cluesInProgress.numCluesUsed++;
            setSolvedWords(solvedWords.slice());
            return;
        }

        // If no clues are in progress, pick a random unsolved word with no clues used yet.
        const unsolvedWords = solvedWords.filter(
            (sw) => !sw.isSolved && sw.numCluesUsed === 0,
        );

        if (unsolvedWords.length > 0) {
            unsolvedWords[0].numCluesUsed++;
            setSolvedWords(solvedWords.slice());
        }
    };

    const giveUp = () => {
        setSolvedWords(
            solvedWords.map((sw) =>
                sw.isSolved ? sw : { ...sw, isGivenUp: !sw.isSolved },
            ),
        );
        resetSelectedLetters();
    };

    const closeDefinition = () => {
        setDefinitionWord(undefined);
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
                    if (
                        event.target instanceof Element &&
                        event.target.closest(
                            ".game-word-button, #game-definition button, a[href]",
                        ) != null
                    ) {
                        return;
                    }
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

    const renderScore = () => {
        const { score, maxScore, numSolved } = getScores(solvedWords);
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
                        Words solved: <strong>{numSolved}</strong> /{" "}
                        {solvedWords.length}
                    </span>
                </div>
            </div>
        );
    };

    const renderWord = (word: SolvedWord): JSX.Element | JSX.Element[] => {
        const wordLetters = word.word.text.split("").map((letter, index) => (
            <span
                key={index}
                className={classNames(
                    "word-letter",
                    word.isGivenUp && "given-up",
                )}
            >
                {word.isSolved || word.isGivenUp
                    ? letter.toUpperCase()
                    : undefined}
            </span>
        ));

        if (
            (!word.isSolved && !word.isGivenUp) ||
            word.word.definition == null
        ) {
            return wordLetters;
        }

        return (
            <button
                type="button"
                className="game-word-button btn focus-ring d-flex p-0 border-0 rounded-1 text-body"
                onClick={() => setDefinitionWord(word.word)}
            >
                {wordLetters}
            </button>
        );
    };

    const renderWords = () => {
        return (
            <div className="game-words">
                {solvedWords.map((word) => (
                    <div key={word.word.text} className="game-word">
                        {renderWord(word)}
                    </div>
                ))}
            </div>
        );
    };

    const renderDefinition = () => {
        if (definitionWord == null) {
            return null;
        }

        return (
            <section
                id="game-definition"
                className="game-definition mw-100 mx-auto mb-3 p-3 text-start border border-secondary rounded text-break"
            >
                <div className="d-flex align-items-center justify-content-between gap-2">
                    <h2 id="game-definition-word" className="h6 mb-0">
                        {definitionWord.text.toUpperCase()}
                    </h2>
                    <button
                        type="button"
                        className="btn-close flex-shrink-0 p-2"
                        aria-label="Close definition"
                        onClick={closeDefinition}
                    />
                </div>
                <div
                    className="mt-2"
                    // oxlint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: definitionWord.definition ?? "",
                    }}
                />
            </section>
        );
    };

    const renderSelected = () => {
        return (
            <div className="letter-row">
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
            <div className="mt-3 letter-row">
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
            <div className="mt-4 game-buttons game-actions">
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
                    className="btn btn-primary"
                    disabled={isDone || lastSubmission == null}
                    onClick={useLastSubmission}
                >
                    Last
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isDone}
                    onClick={resetSelectedLetters}
                >
                    Clear
                </button>
                <button
                    type="button"
                    className="btn btn-success ms-auto"
                    disabled={isDone || numSelectedLetters < 3}
                    onClick={submitSelectedLetters}
                >
                    Enter
                </button>
            </div>
        );
    };

    const renderClues = () => {
        return (
            <div className="game-clues mt-2">
                {solvedWords.map((word) => {
                    const clues =
                        word.numCluesUsed > 0 &&
                        !word.isSolved &&
                        !word.isGivenUp
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
            <div className="mt-5 game-buttons game-actions">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={giveUp}
                >
                    Give up
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-auto"
                    disabled={isDone}
                    onClick={useClue}
                >
                    Clue
                </button>
            </div>
        );
    };

    return (
        <div
            className="text-center"
            style={{
                "--letter-count": letters.length,
                "--word-width": `${longestWordLength * 1.35}rem`,
                "--word-columns": Math.max(
                    1,
                    Math.min(5, Math.floor(words.length / 3)),
                ),
            }}
        >
            {renderScore()}
            {renderWords()}
            {renderDefinition()}
            {renderSelected()}
            {renderAvailable()}
            {renderButtons()}
            {renderClues()}
            {renderGiveUpButton()}
        </div>
    );
}

function getScores(solvedWords: SolvedWord[]): {
    score: number;
    maxScore: number;
    numSolved: number;
} {
    let score = 0;
    let maxScore = 0;
    let numSolved = 0;

    for (const sw of solvedWords) {
        const wordScore = getWordScore(sw.word);
        maxScore += wordScore;

        if (sw.isSolved) {
            numSolved++;
            const multiplier = Math.max(0.25, 1 - sw.numCluesUsed * 0.15);
            score += Math.round(wordScore * multiplier);
        }
    }

    return { score, maxScore, numSolved };
}

function getWordScore(word: Word): number {
    return word.text.length ** 2;
}

function getDefaultSelected(length: number): (Letter | null)[] {
    return Array.from({ length }, () => null);
}
