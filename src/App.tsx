import type { JSX } from "preact";
import { useState } from "preact/hooks";
import vocabulary from "../assets/vocabulary.json";
import { findWords } from "./findWords";
import { Game } from "./Game.js";
import { generateLetters } from "./generateLetters";
import type { Letter, Word } from "./types";

const context = {
    letters: [
        {
            id: "letter0",
            letter: "T",
        },
        {
            id: "letter1",
            letter: "G",
        },
        {
            id: "letter2",
            letter: "U",
        },
        {
            id: "letter3",
            letter: "E",
        },
        {
            id: "letter4",
            letter: "A",
        },
        {
            id: "letter5",
            letter: "O",
        },
    ],
    words: [
        {
            word: "age",
            familiarityScore: 0.999509,
            definition:
                "Age is a noun that designates a length of time in which something existed or flourished: <i>the </i>age<i> of dinosaurs,</i> <i>the </i>age<i> of steam engines. </i>The age of a person or object is how old they are in years: <i>At what </i>age<i> did you begin to date? </i>If the unit is not years, it is usually specified: <i>Babies </i>ages<i> newborn to 18 months. Middle </i>age is a vague term applied to people from about 45 to 65 years old. Age or ages can also mean a very long time: <i>We haven’t been back there for </i>ages</i><i>. As a verb, age refers to allowing something to reach maturity: <i>I don’t think this beef was </i>aged<i> properly.</i> When a person or something else ages<i>, </i>they get older. ",
        },
        {
            word: "ago",
            familiarityScore: 0.998842,
            definition:
                "Ago marks time elapsed from the present backward: {three days ago}, {years ago}, {not long ago}. It always follows the time expression it modifies. The reference point is usually now, but in narrative can shift to a past moment: {She had arrived two hours ago}. {Long ago} reaches into the distant past; {a moment ago} barely precedes the present.",
        },
        {
            word: "ate",
            familiarityScore: 0.999374,
            definition:
                "Ate is the past tense of eat. {I ate breakfast at seven}. {She ate the whole thing}. The word appears in idioms: {What ate you?} asks what's bothering someone. To have {eaten one's words} is to retract a statement. In slang, especially online, ate means performed excellently: {She ate that performance}.",
        },
        {
            word: "eat",
            familiarityScore: 0.999966,
            definition:
                "Eat is to take food into the body through the mouth, chew, and swallow. The word extends to gradual consumption or destruction: rust eats metal, guilt eats at you. To eat something is also to absorb or accept it: {I'll eat the cost}. If something is {eating you}, it's bothering you persistently. {Eat your words} means to retract a statement, usually with embarrassment. In vulgar slang, to eat someone out is to perform oral sex.",
        },
        {
            word: "ego",
            familiarityScore: 0.997162,
            definition:
                "Ego is one's sense of self—personal identity, self-image, and self-importance. In everyday use, ego often implies excessive self-regard: {His ego won't let him admit he was wrong}. A {big ego} suggests arrogance; a {bruised ego} means wounded pride. In Freudian psychology, the ego mediates between primitive drives and moral constraints. {Check your ego at the door.}",
        },
        {
            word: "eta",
            familiarityScore: 0.808352,
            definition:
                "Eta is the seventh letter of the Greek alphabet (Η, η), used in mathematics, physics, and engineering to represent various quantities like efficiency or viscosity. Outside technical contexts, eta appears mainly in fraternity and sorority names. (Capitalized ETA is the acronym for estimated time of arrival.)",
        },
        {
            word: "get",
            familiarityScore: 0.999538,
            definition:
                "For anyone who wants to achieve perfect fluency in English, get is the word to master. Get is required in hundreds of phrasal verbs, idioms, and colloquial expressions as shorthand for a complex idea. Get expresses the concept of obtain or acquire. Get has many non-literal uses in phrasal verbs, instead signaling a change in status—such as get <i>up, get out,</i> and get <i>over something.</i> The irregular inflections of get are got and gotten. The latter is far more frequent in American English than in British, which typically uses got for the past participle as well as the simple past.",
        },
        {
            word: "got",
            familiarityScore: 0.999485,
            definition:
                "Got is the past tense of get, and for some uses, also the past participle of get. Speakers of British English always use got as the past participle. Americans use got as the past participle in meanings of get related to obligation and possession: <i>Have you got a quarter? You’ve got to be more careful.</i> For other meanings of get, Americans use gotten: <i>I’ve gotten used to her accent. I should have gotten a haircut when I was in town.</i>",
        },
        {
            word: "gut",
            familiarityScore: 0.997443,
            definition:
                "Gut refers to the digestive tract, especially the intestines. A {gut feeling} or {gut reaction} comes from instinct rather than deliberation—the belly as seat of intuition. Guts means courage: {It takes guts to stand up to a bully}. To gut something is to remove its internal organs, or to strip out the interior: {They gutted the building}. A gut punch is a blow to the stomach, or figuratively, devastating news.",
        },
        {
            word: "oat",
            familiarityScore: 0.979834,
            definition:
                "Oat is a cereal grain, typically eaten as oatmeal or rolled oats for breakfast. The plant grows well in cool climates. {Oats} almost always appears in the plural. To {feel one's oats} is to act confidently or frisky. To {sow one's wild oats} is to indulge in youthful excess before settling down.",
        },
        {
            word: "out",
            familiarityScore: 0.999684,
            definition:
                "Whether as adverb, preposition, or adjective, out is almost always used as the opposite of in. Like in, out has uses in which the core meaning is not present: <i>Look out for potholes in the road,</i> or <i>We were out $50 because of all the extra fees.</i> The connection of out with the idea of outside and public has given rise to the adjective and verb uses of the word: someone who is out makes no secret about their affiliation or identity, and when you out someone, you reveal something formerly concealed about them.",
        },
        {
            word: "tag",
            familiarityScore: 0.997882,
            definition:
                "A tag is a label – a physical one, like a <i>price tag</i>, or an intangible one, like the tags on a blog post that associate it with various subjects. Tags often help to identify things, like a soldier’s <i>dog tags</i> or an online document’s <i>HTML tags</i>. To tag something is to attach a tag to it (physically) or to identify it with tags, as when a social media site invites you to tag<i> your friends</i>. When you tag<i> on</i> something, it’s usually unnecessary or an afterthought: <i>She tagged on an extra paragraph to the essay</i>. The same concept extends to tag<i> along</i>, which conveys accompanying or following another person or people, often without an invitation to do so. A different tag is a children’s game involving chasing and touching. ",
        },
        {
            word: "tea",
            familiarityScore: 0.973599,
            definition:
                "The main use of tea is to designate the beverage made from the leaves of <i>Camellia sinensis, </i>but tea can also denote the plant itself, or the dried leaves before they are brewed in water. Tea is also used to designate any other beverage made by infusion of leaves, seeds, or spices in water, as in <i>ginger </i>tea or <i>fenugreek </i>tea<i>. </i>In the UK and some other countries influenced by British culture, tea also designates an afternoon or evening meal that may feature tea as a beverage.",
        },
        {
            word: "toe",
            familiarityScore: 0.999188,
            definition:
                "A toe is any of the digits at the end of your foot. The part of a sock or shoe that covers your toes is also the toe. Toe also describes the lowest part of something, or something shaped like a toe. <i>From head to toe</i> is a way of saying thoroughly or throughout, suggesting that no part is overlooked. If you’re <i>on your toes</i>, you are alert and ready to act. To toe<i> the line</i> is to obey rules and conform to expectations.  ",
        },
        {
            word: "tug",
            familiarityScore: 0.995157,
            definition:
                "Tug is a short, sharp pull: {She gave his sleeve a tug}. To tug is to pull with effort or force: {The child tugged at her mother's hand}. A tug is also a powerful boat that pulls or pushes larger vessels—a tugboat. Figuratively, a tug is an emotional pull: {He felt the tug of nostalgia}. A {tug of war} is a contest where two sides pull opposite ends of a rope, or any struggle between competing forces.",
        },
        {
            word: "auto",
            familiarityScore: 0.967849,
            definition:
                "Auto is a prefix meaning self or automatic: {autocorrect}, {autopilot}, {autobiography}. As a standalone word, auto is a somewhat dated informal term for automobile: {auto insurance}, {auto mechanic}, {the auto industry}. In photography and electronics, auto refers to automatic settings: {Switch the camera to auto}.",
        },
        {
            word: "gate",
            familiarityScore: 0.997928,
            definition:
                "A gate is a passage through a fence or wall that can be opened and closed. This meaning is extended to computing, where a gate is a logical pathway that has two settings, on or off. A place that is gated is accessible only through a gate. The combining form -gate arises from Watergate, the name of a Washington, DC, hotel that was the kernel of the Nixon political scandal in the 1970s. From this, -gate is appended to other words to designate official wrongdoing, like “Irangate” or “Travelgate.”  ",
        },
        {
            word: "goat",
            familiarityScore: 0.998539,
            definition:
                "A goat is a hoofed mammal related to sheep, domesticated for milk, meat, and fiber. Goats are known for eating almost anything and for their ability to climb steep terrain. A goat can also be someone blamed for a failure—the {scapegoat} who cost the team the game. In recent slang, calling someone {the goat} means they're highly skilled or admirable, from the acronym for \"greatest of all time.\" {They made him the goat for the project's failure.} (All-caps GOAT is the acronym.)",
        },
        {
            word: "toga",
            familiarityScore: 0.9501,
            definition:
                "A toga is the loose outer garment worn by citizens of ancient Rome—a single piece of cloth draped over the body and around one shoulder. The toga symbolized Roman citizenship and formal occasions. Today, toga appears mainly in {toga party}, where people wrap themselves in bedsheets in imitation of the ancient garment.",
        },
        {
            word: "outage",
            familiarityScore: 0.982962,
            definition:
                "An outage is an instance of something being not available or used up. The most common kind of outage is a <i>power outage,</i> that is, a loss of electrical power. Most other kinds of outage involve the sudden lack of something that is normally provided at all times, such as water, gas, or Internet or GPS service.  ",
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
        console.log(gameContext);
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
