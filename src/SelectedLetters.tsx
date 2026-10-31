import type { JSX } from "preact";
import type { Letter } from "./types";

interface Props {
    disabled: boolean;
    letters: (Letter | null)[];
    onClick: (letter: Letter) => void;
}

export function SelectedLetters({
    letters,
    disabled,
    onClick,
}: Props): JSX.Element {
    return (
        <div className="letter-row">
            {letters.map((letter, index) => (
                <span key={index} className="selected-letter-wrapper">
                    <button
                        type="button"
                        className="btn btn-lg btn-outline-secondary btn-letter-selected"
                        disabled={disabled || letter == null}
                        onClick={
                            letter == null ? undefined : () => onClick(letter)
                        }
                    >
                        {letter?.letter}
                    </button>
                </span>
            ))}
        </div>
    );
}
