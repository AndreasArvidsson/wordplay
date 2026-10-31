import type { JSX } from "preact";
import { Button } from "./components/Button";
import type { Letter, SubmissionState } from "./types";
import { classNames } from "./util/classNames";
import "./letter.css";

interface Props {
    disabled: boolean;
    letters: (Letter | null)[];
    flash: SubmissionState | undefined;
    onClick: (letter: Letter) => void;
}

export function LettersSelected({
    letters,
    disabled,
    flash,
    onClick,
}: Props): JSX.Element {
    return (
        <div className="d-flex justify-content-center">
            {letters.map((letter, index) => (
                <span
                    key={index}
                    className={classNames(
                        "letter-selected-wrapper",
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
