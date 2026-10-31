import type { JSX } from "preact";

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
                disabled={disabled || !hasSelectedLetters}
                onClick={resetSelectedLetters}
            >
                Clear
            </button>
            <button
                type="button"
                className="btn btn-success ms-auto"
                disabled={disabled || !hasSelectedLetters}
                onClick={submitSelectedLetters}
            >
                Enter
            </button>
        </div>
    );
}
