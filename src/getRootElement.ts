export function getRootElement(): HTMLElement {
    const root = document.getElementById("root");

    if (root == null) {
        throw new Error("Missing root element");
    }

    return root;
}
