import { View } from "./view.js";
import { Controller } from "./controller.js";

document.addEventListener("DOMContentLoaded", () => {
    const view = document.querySelector("calculator-view");
    const controller = new Controller(view);
    view.controller = controller;
});
