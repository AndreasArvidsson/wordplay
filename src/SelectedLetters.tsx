import type { JSX } from "preact";
import { Button } from "./components/Button";
import type { Letter, SubmissionState } from "./types";
import { classNames } from "./util/classNames";

interface Props {
    disabled: boolean;
    letters: (Letter | null)[];
    flash: SubmissionState | undefined;
    onClick: (letter: Letter) => void;
}

export function SelectedLetters({
    letters,
    disabled,
    flash,
    onClick,
}: Props): JSX.Element {
    return (
        <div className="letter-row">
            {letters.map((letter, index) => (
                <span
                    key={index}
                    className={classNames(
                        "selected-letter-wrapper",
                        flash === "success" && "bg-success",
                        flash === "fail" && "bg-danger",
                    )}
                >
                    <Button
                        variant="btn-outline-secondary"
                        large
                        className="btn-letter-selected"
                        disabled={disabled || letter == null}
                        onClick={
                            letter == null ? undefined : () => onClick(letter)
                        }
                    >
                        {letter?.letter}
                    </Button>
                </span>
            ))}
        </div>
    );
}
