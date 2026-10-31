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
                    <Button
                        key={letter.id}
                        variant="btn-outline-secondary"
                        large
                        className="btn-letter-available"
                        disabled={disabled || isSelected}
                        onClick={() => onClick(letter)}
                    >
                        {!isSelected && letter.letter}
                    </Button>
                );
            })}
        </div>
    );
}
