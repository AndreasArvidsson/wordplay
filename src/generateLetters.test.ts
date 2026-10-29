import assert from "node:assert/strict";
import { test } from "node:test";
import { findWords } from "./findWords";
import { generateLetters } from "./generateLetters";
import type { Word } from "./types";

await test("generated rounds include a full-length answer and preserve repeated letters", () => {
    const vocabulary: Word[] = [
        { text: "letter", familiarityScore: 0.9 },
        { text: "let", familiarityScore: 0.9 },
        { text: "tette", familiarityScore: 0.9 },
    ];
    const original = structuredClone(vocabulary);

    for (let i = 0; i < 50; i++) {
        const letters = generateLetters(6, false, vocabulary);
        assert.equal(letters.length, 6);
        assert.deepEqual(letters.toSorted(), ["E", "E", "L", "R", "T", "T"]);
        const words = findWords(letters, false, vocabulary);
        assert.ok(
            words.some(({ text: word }) => word.length === letters.length),
        );
        assert.ok(words.some(({ text: word }) => word === "let"));
        assert.ok(!words.some(({ text: word }) => word === "tette"));
    }

    assert.deepEqual(vocabulary, original);
});

await test("the seed word respects the familiarity setting", (t) => {
    t.mock.method(Math, "random", () => 0.999);
    const vocabulary: Word[] = [
        { text: "letter", familiarityScore: 0.5 },
        { text: "zyzzyx", familiarityScore: 0.49 },
    ];

    const familiarLetters = generateLetters(6, false, vocabulary);
    assert.deepEqual(familiarLetters.toSorted(), [
        "E",
        "E",
        "L",
        "R",
        "T",
        "T",
    ]);
    const unfamiliarLetters = generateLetters(6, true, vocabulary);
    assert.deepEqual(unfamiliarLetters.toSorted(), [
        "X",
        "Y",
        "Y",
        "Z",
        "Z",
        "Z",
    ]);
    assert.ok(
        findWords(unfamiliarLetters, true, vocabulary).some(
            ({ text: word }) => word.length === 6,
        ),
    );
});

await test("unavailable lengths and filtered-out words fail instead of producing empty rounds", () => {
    const vocabulary: Word[] = [{ text: "letter", familiarityScore: 0.4 }];
    assert.throws(
        () => generateLetters(6, false, vocabulary),
        /No 6-letter words/u,
    );
    assert.throws(
        () => generateLetters(7, true, vocabulary),
        /No 7-letter words/u,
    );
    assert.throws(() => generateLetters(6, true, []), /No 6-letter words/u);
    assert.equal(generateLetters(6, true, vocabulary).length, 6);
});

await test("invalid letter counts are rejected", () => {
    for (const count of [0, -1, 2, 3.5, Number.NaN, Infinity]) {
        assert.throws(() => generateLetters(count, false, []), /whole number/u);
    }
});
