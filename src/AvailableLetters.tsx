import type { JSX } from "preact";
import type { Letter } from "./types";

interface Props {
    disabled: boolean;
    letters: Letter[];
    selectedLettersIds: Set<string>;
    onClick: (letter: Letter) => void;
}

export function AvailableLetters({
    disabled,
    letters,
    selectedLettersIds,
    onClick,
}: Props): JSX.Element {
    return (
        <div className="mt-3 letter-row">
            {letters.map((letter) => {
                const isSelected = selectedLettersIds.has(letter.id);
                return (
                    <button
                        key={letter.id}
                        type="button"
                        className="btn btn-lg btn-outline-secondary btn-letter-available"
                        disabled={disabled || isSelected}
                        onClick={() => onClick(letter)}
                    >
                        {!isSelected && letter.letter}
                    </button>
                );
            })}
        </div>
    );
}
