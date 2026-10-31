import type { ComponentChildren, JSX } from "preact";
import { classNames } from "../util/classNames";

interface Props {
    variant: Variant;
    large?: boolean;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    children?: ComponentChildren;
}

type Variant =
    | "btn-primary"
    | "btn-secondary"
    | "btn-success"
    | "btn-danger"
    | "btn-outline-secondary"
    | null;

export function Button({
    variant,
    className,
    large = false,
    disabled = false,
    onClick,
    children,
}: Props): JSX.Element {
    return (
        <button
            type="button"
            className={classNames("btn", large && "btn-lg", variant, className)}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
