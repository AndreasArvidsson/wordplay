import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { shuffleList } from "./shuffleList";
import type { Letter, Word } from "./types";

interface Props {
    letters: Letter[];
    words: Word[];
}

export function Game({ letters, words }: Props): JSX.Element {
    const [shuffledLetters, setShuffledLetters] = useState(letters);
    const [selectedLetters, setSelectedLetters] = useState(
        getDefaultSelected(letters.length),
    );
    const [lastSubmission, setLastSubmission] = useState<(Letter | null)[]>();

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
        setLastSubmission(selectedLetters);
        resetSelectedLetters();
        console.log(word);
    };

    const renderSelected = () => {
        return (
            <div>
                {selectedLetters.map((letter, index) => (
                    <span key={index} className="selected-letter-wrapper">
                        <button
                            type="button"
                            className="btn btn-lg btn-outline-secondary btn-letter-selected"
                            disabled={letter == null}
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
                        disabled={selectedLetters.some(
                            (s) => s?.id === letter.id,
                        )}
                        onClick={() => selectLetter(letter)}
                    >
                        {letter.letter}
                    </button>
                ))}
            </div>
        );
    };

    const renderButtons = () => {
        const numSelectedLetters = selectedLetters.filter(
            (s) => s != null,
        ).length;
        return (
            <div className="mt-3 button-row">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={shuffleLetters}
                >
                    Shuffle
                </button>
                <button
                    type="button"
                    className="btn btn-primary ms-3"
                    disabled={lastSubmission == null}
                    onClick={useLastSubmission}
                >
                    Last
                </button>
                <button
                    type="button"
                    className="btn btn-primary ms-3 float-end"
                    disabled={numSelectedLetters < 3}
                    onClick={submitSelectedLetters}
                >
                    Enter
                </button>
                <button
                    type="button"
                    className="btn btn-primary float-end"
                    onClick={resetSelectedLetters}
                >
                    Clear
                </button>
            </div>
        );
    };

    return (
        <div className="text-center">
            {renderSelected()}
            {renderAvailable()}
            {renderButtons()}
        </div>
    );
}

function getDefaultSelected(length: number): (Letter | null)[] {
    return Array.from({ length }, () => null);
}
