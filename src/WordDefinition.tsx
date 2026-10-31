import type { JSX } from "preact";
import type { Word } from "./types";

interface Props {
    word: Word;
    onClose: () => void;
}

export function WordDefinition({ word, onClose }: Props): JSX.Element {
    return (
        <section className="mb-3 p-2 text-start border border-secondary rounded">
            <div className="d-flex align-items-center">
                <h2 className="h6 mb-0">{word.text.toUpperCase()}</h2>

                <button
                    type="button"
                    className="btn-close ms-auto"
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
