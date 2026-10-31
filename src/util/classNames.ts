type Arg = string | undefined | null | false;

export function classNames(...args: Arg[]): string | undefined {
    return args.filter(Boolean).join(" ") || undefined;
}
