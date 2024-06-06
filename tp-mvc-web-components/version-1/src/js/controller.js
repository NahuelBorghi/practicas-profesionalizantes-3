// src/js/controller.js
import { CalculatorModel } from "./model.js";
import { CalculatorView } from "./view.js";

class CalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Vincular el controlador al evento de clic de los botones de la vista
        this.view.controller = this;
    }

    handleButtonClick(value) {
        const display = this.view.display;
        if (!isNaN(value)) {
            if (this.model.waitingForSecondNumber) {
                this.view.updateDisplay(value);
                this.model.setWaitingForSecondNumber(false);
            } else {
                this.view.updateDisplay(display.value + value);
            }
        } else if (value === ".") {
            if (!display.value.includes(".")) {
                this.view.updateDisplay(display.value + value);
            }
        } else if (value === "BORRAR") {
            this.view.updateDisplay("");
            this.model.setFirstNumber("");
            this.model.setOperator("");
            this.model.setWaitingForSecondNumber(false);
        } else if (["+", "-", "x", "/"].includes(value)) {
            this.model.setFirstNumber(parseFloat(display.value));
            this.model.addToHistory(this.model.firstNumber);
            this.model.addToHistory(value);
            this.model.setOperator(value);
            this.view.updateDisplay("");
            this.model.setWaitingForSecondNumber(true);
        } else if (value === "=") {
            if (this.model.operator === "") {
                return;
            }

            const secondNumber = parseFloat(display.value);
            this.model.addToHistory(secondNumber);
            let result;

            try {
                result = this.model.calculate(secondNumber);
            } catch (error) {
                alert(error.message);
                return;
            }

            this.view.updateDisplay(result);
            this.model.setFirstNumber(result);
            this.model.setOperator("");
            this.model.setWaitingForSecondNumber(false);

            this.model.addToHistory("=");
            this.model.addToHistory(result);
        }

        this.view.updateHistory(this.model.updateHistoryDisplay());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const view = document.querySelector("calculator-view");
    const model = new CalculatorModel();
    new CalculatorController(model, view);
});
