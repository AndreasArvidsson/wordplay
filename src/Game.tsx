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
        (length, { word }) => Math.max(length, word.length),
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
        const foundWord = solvedWords.find((sw) => sw.word.word === word);

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
                sw.numCluesUsed < sw.word.word.length,
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

        if (unsolvedWords.length === 0) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * unsolvedWords.length);
        const randomWord = unsolvedWords[randomIndex];
        randomWord.numCluesUsed++;
        setSolvedWords(solvedWords.slice());
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

    const renderWords = () => {
        return (
            <div className="game-words">
                {solvedWords.map((word) => (
                    <div key={word.word.word} className="game-word">
                        {renderWord(word)}
                    </div>
                ))}
            </div>
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
                    className="btn btn-primary ms-auto"
                    disabled={isDone}
                    onClick={resetSelectedLetters}
                >
                    Clear
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isDone || numSelectedLetters < 3}
                    onClick={submitSelectedLetters}
                >
                    Enter
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
                    className="btn btn-primary ms-auto"
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
            }}
        >
            {renderScore()}
            {renderWords()}
            {renderSelected()}
            {renderAvailable()}
            {renderButtons()}
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
    return word.word.length ** 2;
}

function getDefaultSelected(length: number): (Letter | null)[] {
    return Array.from({ length }, () => null);
}

function renderWord(word: SolvedWord): JSX.Element[] {
    const letters = word.word.word.split("");
    const clues =
        word.numCluesUsed > 0
            ? word.word.clues?.slice(0, word.numCluesUsed)
            : undefined;

    return letters.map((letter, index) => (
        <span
            key={index}
            className={classNames(
                "word-letter",
                word.isGivenUp && "given-up",
                clues != null && "has-clues",
            )}
            title={clues?.join("\n")}
        >
            {word.isSolved || word.isGivenUp ? letter.toUpperCase() : undefined}
        </span>
    ));
}
