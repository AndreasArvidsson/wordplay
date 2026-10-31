// Shuffles a list using the Fisher-Yates algorithm and returns a new shuffled array.
export function shuffleList<T>(list: readonly T[]): T[] {
    const shuffled = list.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}
