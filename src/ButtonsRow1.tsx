import type { JSX } from "preact";
import { Button } from "./components/Button";

interface Props {
    disabled: boolean;
    hasLastSubmission: boolean;
    hasSelectedLetters: boolean;
    shuffleLetters: () => void;
    useLastSubmission: () => void;
    resetSelectedLetters: () => void;
    submitSelectedLetters: () => void;
}

export function ButtonsRow1({
    disabled,
    hasLastSubmission,
    hasSelectedLetters,
    shuffleLetters,
    useLastSubmission,
    resetSelectedLetters,
    submitSelectedLetters,
}: Props): JSX.Element {
    return (
        <div className="d-flex gap-3 mt-4">
            <Button
                variant="btn-primary"
                disabled={disabled}
                onClick={shuffleLetters}
            >
                Shuffle
            </Button>

            <Button
                variant="btn-primary"
                disabled={disabled || !hasLastSubmission}
                onClick={useLastSubmission}
            >
                Last
            </Button>

            <Button
                variant="btn-primary"
                disabled={disabled || !hasSelectedLetters}
                onClick={resetSelectedLetters}
            >
                Clear
            </Button>

            <Button
                variant="btn-success"
                className="ms-auto"
                disabled={disabled || !hasSelectedLetters}
                onClick={submitSelectedLetters}
            >
                Enter
            </Button>
        </div>
    );
}
