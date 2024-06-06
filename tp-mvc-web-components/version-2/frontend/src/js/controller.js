export class Controller {
    constructor(view) {
        this.view = view;
        this.historyItems = [];
        this.firstNumber = "";
        this.operator = "";
        this.waitingForSecondNumber = false;
    }

    async handleButtonClick(value) {
        const display = this.view.display;
        if (!isNaN(value)) {
            this.handleNumber(value);
        } else if (value === ".") {
            this.handleDecimal();
        } else if (value === "BORRAR") {
            this.handleClear();
        } else if (["+", "-", "x", "/"].includes(value)) {
            this.handleOperator(value);
        } else if (value === "=") {
            await this.handleCalculate();
        }
    }

    handleNumber(value) {
        const display = this.view.display;
        if (this.waitingForSecondNumber) {
            this.view.updateDisplay(value);
            this.waitingForSecondNumber = false;
        } else {
            this.view.updateDisplay(display.value + value);
        }
    }

    handleDecimal() {
        const display = this.view.display;
        if (!display.value.includes(".")) {
            this.view.updateDisplay(display.value + ".");
        }
    }

    handleClear() {
        this.view.updateDisplay("");
        this.firstNumber = "";
        this.operator = "";
        this.waitingForSecondNumber = false;
    }

    handleOperator(value) {
        const display = this.view.display;
        this.firstNumber = parseFloat(display.value);
        this.historyItems.push(this.firstNumber);
        this.historyItems.push(value);
        this.operator = value;
        this.view.updateDisplay("");
        this.waitingForSecondNumber = true;
    }

    async handleCalculate() {
        if (this.operator === "") {
            return;
        }

        const display = this.view.display;
        const secondNumber = parseFloat(display.value);
        this.historyItems.push(secondNumber);

        try {
            const result = await this.calculate(secondNumber);
            this.view.updateDisplay(result);
            this.firstNumber = result;
            this.operator = "";
            this.waitingForSecondNumber = false;
            this.historyItems.push("=");
            this.historyItems.push(result);
            this.view.updateHistory(this.historyItems);
        } catch (error) {
            alert(error.message);
        }
    }

    async calculate(secondNumber) {
        const response = await fetch("http://localhost:8080/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstNumber: this.firstNumber,
                operator: this.operator,
                secondNumber,
            }),
        });

        if (!response.ok) {
            throw new Error("Error calculating");
        }

        const data = await response.json();
        return data.result;
    }
}
