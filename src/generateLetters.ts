import { shuffleList } from "./shuffleList";

const vowels = ["A", "E", "I", "O", "U"];

// oxfmt-ignore
const consonants = [
    "B", "B",
    "C", "C", "C",
    "D", "D", "D", "D", "D", "D",
    "F", "F", "F", "F", "F", "F",
    "G", "G", "G",
    "H", "H",
    "J",
    "K",
    "L", "L", "L", "L", "L", "L",
    "M", "M", "M", "M",
    "N", "N", "N", "N", "N", "N", "N", "N",
    "P", "P", "P", "P",
    "Q",
    "R", "R", "R", "R", "R", "R", "R", "R", "R",
    "S", "S", "S", "S", "S", "S", "S", "S", "S",
    "T", "T", "T", "T", "T", "T", "T", "T", "T",
    "V", "V",
    "W", "W",
    "X",
    "Y", "Y", "Y",
    "Z"
];

function drawLetter(pool: string[]): string {
    const index = Math.floor(Math.random() * pool.length);
    return pool.splice(index, 1)[0];
}

export function generateLetters(numLetters: number): string[] {
    // Determine the number of vowels to include (between 3 and 5).
    const vowelCount = getVowelCount(numLetters);

    const vowelPool = vowels.slice();
    const consonantPool = [...consonants];

    const letters: string[] = [];

    for (let i = 0; i < vowelCount; i++) {
        letters.push(drawLetter(vowelPool));
    }

    for (let i = vowelCount; i < numLetters; i++) {
        letters.push(drawLetter(consonantPool));
    }

    return shuffleList(letters);
}

function getVowelCount(numLetters: number): number {
    const min = Math.floor(numLetters / 3);
    // The number of vowels will be at least 1/3 of the total letters and at most 1/3 + 2.
    return min + Math.floor(Math.random() * 3);
}
