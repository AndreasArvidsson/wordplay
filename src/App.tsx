import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { findWords } from "./findWords";
import { Game } from "./Game.js";
import { generateLetters } from "./generateLetters.js";
import type { Letter, Word } from "./types";

const context = {
    letters: [
        { letter: "A", id: `A0` },
        { letter: "D", id: `D1` },
        { letter: "O", id: `O2` },
        { letter: "B", id: `B3` },
        { letter: "U", id: `U4` },
        { letter: "I", id: `I5` },
    ],
    words: [
        {
            word: "aid",
            familiarityScore: 0.994986,
            definition:
                "Aid is help or assistance, especially of a practical or material kind. Countries send foreign aid—money, food, supplies—to those in need. A hearing aid assists with sound; a visual aid helps explain something. First aid is emergency medical care. To aid someone is to help them: {She aided the investigation}. An aide, spelled differently, is a person who assists.",
        },
        {
            word: "audio",
            familiarityScore: 0.995487,
            definition:
                "Audio refers to sound, especially as recorded, transmitted, or reproduced electronically. It covers the range of frequencies humans can hear. Audio works as both noun and adjective: {The audio was terrible on that call}, {audio equipment}, {audio file}. In video contexts, audio is the sound component as distinct from the visual: {We have picture but no audio}.",
        },
        {
            word: "bad",
            familiarityScore: 0.999968,
            definition:
                "Though less frequent than its usual opposite good, bad has a wide range of meanings that grow out of its core function of characterizing something or someone as lacking good or desirable qualities. The large number of adjectives that may be considered as synonyms of bad in various contexts are all words with a negative connotation. To the consternation of many, bad developed a slang meaning in the late 20th century that is its opposite; in some limited contexts, bad means good.",
        },
        {
            word: "bid",
            familiarityScore: 0.995112,
            definition:
                "A bid is an offer, especially one stating a price you're willing to pay: {The highest bid wins the auction}. To bid is to make such an offer, or in card games, to declare how many tricks you intend to take. A bid can also be an attempt to achieve something: {a bid for power}, {a bid to break the record}. The past tense is bid (for offers) or bade (for farewells and commands, as in {She bade him farewell}). (Capitalized BID is an acronym in specialized fields.)",
        },
        {
            word: "bio",
            familiarityScore: 0.967742,
            definition:
                "Bio is an informal shortening of biography, referring to a brief account of someone's life or background. On social media and professional platforms, your bio is the short self-description in your profile: {Her Twitter bio says she's a writer and cat enthusiast}. Bio also clips biological or biology: {bio class}, {bio major}.",
        },
        {
            word: "boa",
            familiarityScore: 0.969301,
            definition:
                "A boa is a large snake that kills prey by coiling around it and squeezing—a constrictor. The term covers various species, most famously the boa constrictor of Central and South America. A boa is also a long, fluffy scarf made of feathers or fur, worn draped around the neck and shoulders: {She wore a pink feather boa to the party}. The garment takes its name from its snake-like shape and the way it wraps around the wearer.",
        },
        {
            word: "bud",
            familiarityScore: 0.995077,
            definition:
                "A bud is a small growth on a plant that develops into a leaf, flower, or shoot. The word extends to anything in an early stage of development: {nipped in the bud} means stopped before it can grow. To bud is to produce buds or begin developing. Bud is also informal address between men, short for buddy: {Hey bud, how's it going?}",
        },
        {
            word: "dab",
            familiarityScore: 0.977102,
            definition:
                "A dab is a small amount or portion of something: <i>I’ll take a dab of butter</i>. A quick, small motion involving some purpose is also a dab. This dab is frequently encountered as a verb: Dab<i> the sponge gently around the wound</i>. The fixed expression <i>smack dab in the middle</i> (or center) means exactly in the middle. A concentrated form of cannabis is called dab and using this for recreational purposes is called dabbing. ",
        },
        {
            word: "dub",
            familiarityScore: 0.959144,
            definition:
                "Despite low frequency, dub has several meanings that don’t overlap. Most frequent is the verb that is about giving names and titles to people and things: <i>He dubbed the pastry chef “Bakemaster.”</i> Another dub verb means to add or replace the audio part of a video presentation: <i>The film was dubbed in English</i>. The most frequent noun use of dub today is for a genre of music with irregular and unexpected sounds: Dub<i>step is the epitome of electronic dance music</i>. ",
        },
        {
            word: "duo",
            familiarityScore: 0.985335,
            definition:
                "A duo is a pair, especially two people who perform or work together: {a comedy duo}, {a musical duo}. The word emphasizes partnership or collaboration more than simply counting two of something. It can also describe any twosome: {The duo spent the afternoon plotting their next move}.",
        },
    ],
};

interface GameContext {
    letters: Letter[];
    words: Word[];
}

export function App(): JSX.Element {
    const [numLetters, setNumLetters] = useState(6);
    const [includeUnfamiliarWords, setIncludeUnfamiliarWords] = useState(false);
    const [gameContext, setGameContext] = useState<GameContext>(context);

    if (gameContext != null) {
        return <Game letters={gameContext.letters} words={gameContext.words} />;
    }

    const generateGameContext = () => {
        const letters = generateLetters(numLetters);
        const lettersWithId = letters.map((letter, index) => ({
            id: `letter${index}`,
            letter,
        }));
        const words = findWords(letters, includeUnfamiliarWords, vocabulary);
        setGameContext({ letters: lettersWithId, words });
    };

    return (
        <>
            <h1>Wordplay</h1>

            <table>
                <tbody>
                    <tr>
                        <td>Number of letters</td>
                        <td>
                            <input
                                type="number"
                                className="form-control"
                                value={numLetters}
                                onChange={(e) =>
                                    setNumLetters(Number(e.currentTarget.value))
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="pe-3">Include unfamiliar words</td>
                        <td>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={includeUnfamiliarWords}
                                onChange={(e) =>
                                    setIncludeUnfamiliarWords(
                                        e.currentTarget.checked,
                                    )
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td />
                        <td>
                            <button
                                type="button"
                                className="btn btn-primary mt-3"
                                onClick={generateGameContext}
                            >
                                Start
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
