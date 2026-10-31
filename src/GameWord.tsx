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
                "game-word-letter border border-secondary rounded-1",
                word.isGivenUp && "given-up",
            )}
        >
            {showText && letter.toUpperCase()}
        </span>
    ));

    return (
        <Button
            variant={null}
            className="game-word d-flex p-0 border-0"
            disabled={!showText || word.word.definition == null}
            onClick={showText ? onClick : undefined}
        >
            {wordLetters}
        </Button>
    );
}
