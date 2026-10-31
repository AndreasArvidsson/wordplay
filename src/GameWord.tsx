import type { JSX } from "preact";
import { Button } from "./components/Button";
import type { GameWord } from "./types";
import { classNames } from "./util/classNames";
import "./GameWord.css";

interface Props {
    word: GameWord;
    onClick: () => void;
}

export function GameWordComponent({ word, onClick }: Props): JSX.Element {
    const showText = word.isSolved || word.isGivenUp;

    const wordLetters = word.word.text.split("").map((letter, index) => (
        <span
            key={index}
            className={classNames(
                "game-word-letter",
                word.isGivenUp && "given-up",
            )}
        >
            {showText && letter.toUpperCase()}
        </span>
    ));

    if (!showText || word.word.definition == null) {
        return <div className="game-word">{wordLetters}</div>;
    }

    return (
        <div className="game-word">
            <Button
                variant={null}
                className="game-word-button focus-ring d-flex p-0 border-0 rounded-1 text-body"
                onClick={onClick}
            >
                {wordLetters}
            </Button>
        </div>
    );
}
