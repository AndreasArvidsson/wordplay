import type { JSX } from "preact";
import { Button } from "./components/Button";
import "./ButtonsRow.css";

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
            <div className="mt-5 buttons-row">
                <Button variant="btn-success" onClick={exitGame}>
                    Exit
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-5 buttons-row">
            <Button variant="btn-danger" disabled={disabled} onClick={giveUp}>
                Give up
            </Button>

            <Button
                variant="btn-secondary"
                className="ms-auto"
                disabled={disabled}
                onClick={useClue}
            >
                Clue
            </Button>
        </div>
    );
}
