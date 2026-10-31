import { clamp } from "./clamp";

export function getWordColumnCount(
    wordWidths: number[],
    availableWidth: number,
    gap: number,
): number {
    const maxColumns = clamp(Math.floor(wordWidths.length / 3), 1, 5);

    for (let count = maxColumns; count > 1; count--) {
        const rows = Math.ceil(wordWidths.length / count);
        let requiredWidth = 0;
        let actualColumns = 0;

        for (let start = 0; start < wordWidths.length; start += rows) {
            requiredWidth += Math.max(...wordWidths.slice(start, start + rows));
            actualColumns++;
        }

        requiredWidth += (actualColumns - 1) * gap;

        if (requiredWidth <= availableWidth) {
            return count;
        }
    }

    return 1;
}
