import type { JSX } from "preact";
import { GameWordComponent } from "./GameWord";
import type { GameWord, Word } from "./types";
import "./GameWords.css";

interface Props {
    words: GameWord[];
    defineWord: (word: Word) => void;
}

export function GameWords({ words, defineWord }: Props): JSX.Element {
    return (
        <div className="game-words">
            {words.map((word) => (
                <GameWordComponent
                    key={word.word.text}
                    word={word}
                    onClick={() => defineWord(word.word)}
                />
            ))}
        </div>
    );
}
