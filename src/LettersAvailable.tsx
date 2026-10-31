import type { JSX } from "preact";
import { Button } from "./components/Button";
import type { Letter } from "./types";
import "./letter.css";

interface Props {
    disabled: boolean;
    letters: Letter[];
    selectedLettersIds: Set<string>;
    onClick: (letter: Letter) => void;
}

export function LettersAvailable({
    disabled,
    letters,
    selectedLettersIds,
    onClick,
}: Props): JSX.Element {
    return (
        <div className="mt-3 d-flex justify-content-center">
            {letters.map((letter) => {
                const isSelected = selectedLettersIds.has(letter.id);
                return (
                    <span key={letter.id} className="letter-available-wrapper">
                        <Button
                            variant="btn-outline-secondary"
                            large
                            className="btn-letter-available"
                            disabled={disabled || isSelected}
                            onClick={() => onClick(letter)}
                        >
                            {!isSelected && letter.letter}
                        </Button>
                    </span>
                );
            })}
        </div>
    );
}
