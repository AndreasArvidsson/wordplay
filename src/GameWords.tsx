import type { JSX } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { GameWordComponent } from "./GameWord";
import type { GameWord, Word } from "./types";
import { getWordColumnCount } from "./util/getWordColumnCount";

interface Props {
    words: GameWord[];
    defineWord: (word: Word) => void;
}

export function GameWords({ words, defineWord }: Props): JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState({ width: 0, gap: 0, letterWidth: 0 });

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (container == null) {
            return () => {
                // no-op
            };
        }

        const updateLayout = () => {
            const letter = container.querySelector(".game-word-letter");

            if (letter == null) {
                return;
            }

            const containerStyle = getComputedStyle(container);
            const letterStyle = getComputedStyle(letter);
            const width =
                container.clientWidth -
                parsePixels(containerStyle.paddingLeft) -
                parsePixels(containerStyle.paddingRight);
            const gap = parsePixels(containerStyle.columnGap);
            const letterWidth =
                parsePixels(letterStyle.flexBasis) +
                parsePixels(letterStyle.marginRight);
            setLayout((previous) =>
                previous.width === width &&
                previous.gap === gap &&
                previous.letterWidth === letterWidth
                    ? previous
                    : { width, gap, letterWidth },
            );
        };

        const observer = new ResizeObserver(updateLayout);
        observer.observe(container);

        return () => observer.disconnect();
    }, [words]);

    const numColumns = getWordColumnCount(
        words.map(({ word }) => word.text.length * layout.letterWidth),
        layout.width,
        layout.gap,
    );
    const numRows = Math.ceil(words.length / numColumns);
    const columns = Array.from({ length: numColumns }, (_, index) =>
        words.slice(index * numRows, (index + 1) * numRows),
    ).filter((column) => column.length > 0);

    return (
        <div
            ref={containerRef}
            className="d-flex align-items-start gap-3 mb-3 p-2 bg-secondary border border-secondary rounded"
        >
            {columns.map((column) => (
                <div key={column[0].word.text}>
                    {column.map((word) => (
                        <GameWordComponent
                            key={word.word.text}
                            word={word}
                            onClick={() => defineWord(word.word)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

function parsePixels(value: string): number {
    // Computed CSS lengths include the px suffix.
    // oxlint-disable-next-line unicorn/prefer-number-coercion
    return Number.parseFloat(value);
}
