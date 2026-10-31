import type { JSX } from "preact";

interface Props {
    disabled: boolean;
    hasLastSubmission: boolean;
    numSelectedLetters: number;
    shuffleLetters: () => void;
    useLastSubmission: () => void;
    resetSelectedLetters: () => void;
    submitSelectedLetters: () => void;
}

export function ButtonsRow1({
    disabled,
    hasLastSubmission,
    numSelectedLetters,
    shuffleLetters,
    useLastSubmission,
    resetSelectedLetters,
    submitSelectedLetters,
}: Props): JSX.Element {
    return (
        <div className="mt-4 game-buttons game-actions">
            <button
                type="button"
                className="btn btn-primary"
                disabled={disabled}
                onClick={shuffleLetters}
            >
                Shuffle
            </button>
            <button
                type="button"
                className="btn btn-primary"
                disabled={disabled || !hasLastSubmission}
                onClick={useLastSubmission}
            >
                Last
            </button>
            <button
                type="button"
                className="btn btn-primary"
                disabled={disabled || numSelectedLetters === 0}
                onClick={resetSelectedLetters}
            >
                Clear
            </button>
            <button
                type="button"
                className="btn btn-success ms-auto"
                disabled={disabled || numSelectedLetters < 3}
                onClick={submitSelectedLetters}
            >
                Enter
            </button>
        </div>
    );
}
