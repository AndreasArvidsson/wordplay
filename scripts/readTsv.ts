import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { createGunzip } from "node:zlib";

export async function* readTsv(
    path: string,
    headers: string[],
): AsyncGenerator<string[]> {
    const stream = createReadStream(path).pipe(createGunzip());

    const lines = createInterface({
        input: stream,
        crlfDelay: Infinity,
    });

    let isFirstLine = true;

    for await (const line of lines) {
        const values = line.split("\t").map(unquoteField);

        if (isFirstLine) {
            isFirstLine = false;
            assertHeaders(headers, values);
            continue;
        }

        if (values.length !== headers.length) {
            throw new Error(
                `Unexpected number of columns: expected ${headers.length}, got ${values.length}`,
            );
        }

        yield values;
    }
}

function unquoteField(value: string): string {
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1).replaceAll('""', '"');
    }
    return value;
}

function assertHeaders(headers: string[], values: string[]) {
    if (headers.length !== values.length) {
        throw new Error(
            `Unexpected number of columns: expected ${headers.length}, got ${values.length}`,
        );
    }

    for (const header of headers) {
        if (!values.includes(header)) {
            throw new Error(`Missing expected header: ${header}`);
        }
    }
}
