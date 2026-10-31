import type { JSX } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { AvailableLetters } from "./AvailableLetters";
import { ButtonsRow1 } from "./ButtonsRow1";
import { ButtonsRow2 } from "./ButtonsRow2";
import { Clues } from "./Clues";
import { GameScores } from "./GameScores";
import { GameWords } from "./GameWords";
import { SelectedLetters } from "./SelectedLetters";
import type { GameWord, Letter, SubmissionState, Word } from "./types";
import { createGameWord } from "./util/createGameWord";
import { shuffleList } from "./util/shuffleList";
import { WordDefinition } from "./WordDefinition";

interface Props {
    letters: Letter[];
    words: Word[];
    exitGame: () => void;
}

export function Game({ letters, words, exitGame }: Props): JSX.Element {
    const [shuffledLetters, setShuffledLetters] = useState(letters);
    const [selectedLetters, setSelectedLetters] = useState(
        getDefaultSelected(letters.length),
    );
    const [lastSubmission, setLastSubmission] = useState<(Letter | null)[]>();
    const [definitionWord, setDefinitionWord] = useState<Word>();
    const [gameWords, setGameWords] = useState<GameWord[]>(
        words.map((word) => createGameWord(word)),
    );
    const [submissionState, setSubmissionState] = useState<SubmissionState>();

    const isDone = gameWords.every((sw) => sw.isSolved || sw.isGivenUp);
    const disabledButtons = isDone || submissionState != null;
    const hasSelectedLetters = selectedLetters.some((s) => s != null);
    const longestWordLength = words.reduce(
        (length, { text: word }) => Math.max(length, word.length),
        1,
    );

    const selectLetter = (letter: Letter) => {
        const copy = selectedLetters.slice();
        const index = selectedLetters.findIndex((i) => i == null);
        copy[index] = letter;
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
        setShuffledLetters(shuffleList(letters));
    };

    const submitSelectedLetters = () => {
        const word = selectedLetters
            .map((s) => s?.letter ?? "")
            .join("")
            .toLowerCase();
        const foundWord = gameWords.find((sw) => sw.word.text === word);

        setSubmissionState(foundWord == null ? "fail" : "success");

        setTimeout(() => {
            if (foundWord != null) {
                foundWord.isSolved = true;
                setGameWords(gameWords.slice());
            }

            setSubmissionState(undefined);
            setLastSubmission(selectedLetters);
            resetSelectedLetters();
        }, 500);
    };

    const useClue = () => {
        const word = gameWords.find(
            (w) => !w.isSolved && w.numCluesUsed < w.clues.length,
        );

        if (word != null) {
            word.numCluesUsed++;
            setGameWords(gameWords.slice());
        }
    };

    const giveUp = () => {
        setGameWords(
            gameWords.map((sw) =>
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
                disabledButtons ||
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
                            ".game-word-button, .btn-close, a[href]",
                        ) != null
                    ) {
                        return;
                    }
                    event.preventDefault();
                    if (hasSelectedLetters) {
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

    return (
        <div
            className="text-center"
            style={{
                "--letter-count": letters.length,
                "--word-width": `${longestWordLength * 1.35}rem`,
                "--word-columns": Math.max(
                    1,
                    Math.min(5, Math.floor(gameWords.length / 3)),
                ),
            }}
        >
            <GameScores words={gameWords} />

            <GameWords words={gameWords} defineWord={setDefinitionWord} />

            {definitionWord && (
                <WordDefinition
                    word={definitionWord}
                    onClose={closeDefinition}
                />
            )}

            <Clues words={gameWords} />

            <SelectedLetters
                letters={selectedLetters}
                disabled={disabledButtons}
                flash={submissionState}
                onClick={deselectLetter}
            />

            <AvailableLetters
                disabled={disabledButtons}
                letters={letters}
                selectedLettersIds={
                    new Set(selectedLetters.map((l) => l?.id ?? ""))
                }
                onClick={selectLetter}
            />

            <ButtonsRow1
                disabled={disabledButtons}
                hasLastSubmission={lastSubmission != null}
                hasSelectedLetters={hasSelectedLetters}
                shuffleLetters={shuffleLetters}
                useLastSubmission={useLastSubmission}
                resetSelectedLetters={resetSelectedLetters}
                submitSelectedLetters={submitSelectedLetters}
            />

            <ButtonsRow2
                isDone={isDone}
                disabled={disabledButtons}
                exitGame={exitGame}
                giveUp={giveUp}
                useClue={useClue}
            />
        </div>
    );
}

function getDefaultSelected(length: number): (Letter | null)[] {
    return Array.from({ length }, () => null);
}
