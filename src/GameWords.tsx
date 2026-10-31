import type { JSX } from "preact";
import { GameWordComponent } from "./GameWordComponent";
import type { GameWord, Word } from "./types";

interface Props {
    words: GameWord[];
    defineWord: (word: Word) => void;
}

export function GameWords({ words, defineWord }: Props): JSX.Element {
    return (
        <div className="game-words">
            {words.map((word) => (
                <div key={word.word.text} className="game-word">
                    <GameWordComponent
                        word={word}
                        onClick={() => defineWord(word.word)}
                    />
                </div>
            ))}
        </div>
    );
}
