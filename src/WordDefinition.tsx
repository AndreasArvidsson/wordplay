import type { JSX } from "preact";
import type { Word } from "./types";

interface Props {
    word: Word;
    onClose: () => void;
}

export function WordDefinition({ word, onClose }: Props): JSX.Element {
    return (
        <section
            id="game-definition"
            className="game-definition mw-100 mx-auto mb-3 p-3 text-start border border-secondary rounded text-break"
        >
            <div className="d-flex align-items-center justify-content-between gap-2">
                <h2 id="game-definition-word" className="h6 mb-0">
                    {word.text.toUpperCase()}
                </h2>
                <button
                    type="button"
                    className="btn-close flex-shrink-0 p-2"
                    aria-label="Close definition"
                    onClick={onClose}
                />
            </div>
            <div
                className="mt-2"
                // oxlint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: word.definition ?? "",
                }}
            />
        </section>
    );
}
