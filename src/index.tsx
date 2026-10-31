import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import { render } from "preact";
import { App } from "./App.js";

render(<App />, getRootElement());

function getRootElement(): HTMLElement {
    const root = document.getElementById("root");

    if (root == null) {
        throw new Error("Missing root element");
    }

    return root;
}
