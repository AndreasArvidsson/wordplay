import type { JSX } from "preact";
import type { GameContext } from "./types";

interface Props {
    context: GameContext;
}

export function Game({ context }: Props): JSX.Element {
    const { letters, words } = context;
    console.log(words);
    return <div>{letters}</div>;
}
