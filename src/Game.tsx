import type { JSX } from "preact";
import { useState } from "preact/hooks";
import type { Word } from "./types";

interface Props {
    letters: string[];
    words: Word[];
}

export function Game({ letters, words }: Props): JSX.Element {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    const renderSelected = () => {
        const selectedPadded = selectedIndices.map((index) => ({
            index,
            letter: letters[index],
        }));

        while (selectedPadded.length < letters.length) {
            selectedPadded.push({ index: -1, letter: "" });
        }

        return (
            <div>
                {selectedPadded.map(({ letter, index }) => (
                    <span key={index} className="selected-letter-wrapper">
                        <button
                            type="button"
                            className="btn btn-lg btn-outline-secondary btn-letter-selected"
                            disabled={index === -1}
                            onClick={() => {
                                setSelectedIndices(
                                    selectedIndices.filter((i) => i !== index),
                                );
                            }}
                        >
                            {letter}
                        </button>
                    </span>
                ))}
            </div>
        );
    };

    const renderAvailable = () => {
        return (
            <div className="mt-3">
                {letters.map((letter, index) => (
                    <button
                        key={index}
                        type="button"
                        className="btn btn-lg btn-outline-secondary btn-letter-available"
                        disabled={selectedIndices.includes(index)}
                        onClick={() =>
                            setSelectedIndices([...selectedIndices, index])
                        }
                    >
                        {letter}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="text-center">
            {renderSelected()}
            {renderAvailable()}
        </div>
    );
}
