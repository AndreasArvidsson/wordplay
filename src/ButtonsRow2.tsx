import type { JSX } from "preact";

interface Props {
    isDone: boolean;
    disabled: boolean;
    exitGame: () => void;
    giveUp: () => void;
    useClue: () => void;
}

export function ButtonsRow2({
    isDone,
    disabled,
    exitGame,
    giveUp,
    useClue,
}: Props): JSX.Element {
    if (isDone) {
        return (
            <div className="mt-5 game-buttons">
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={exitGame}
                >
                    Exit
                </button>
            </div>
        );
    }

    return (
        <div className="mt-5 game-buttons game-actions">
            <button
                type="button"
                className="btn btn-danger"
                disabled={disabled}
                onClick={giveUp}
            >
                Give up
            </button>

            <button
                type="button"
                className="btn btn-secondary ms-auto"
                disabled={disabled}
                onClick={useClue}
            >
                Clue
            </button>
        </div>
    );
}
