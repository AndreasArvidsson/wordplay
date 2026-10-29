import { render } from "preact";
import { App } from "./App.js";
// oxlint-disable-next-line import/no-unassigned-import
import "bootstrap/dist/css/bootstrap.min.css";
// oxlint-disable-next-line import/no-unassigned-import
import "./styles.css";

render(<App />, getRootElement());

function getRootElement(): HTMLElement {
    const root = document.getElementById("root");

    if (root == null) {
        throw new Error("Missing root element");
    }

    return root;
}
