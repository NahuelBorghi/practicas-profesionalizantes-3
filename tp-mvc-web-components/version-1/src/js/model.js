// src/js/model.js
export class CalculatorModel {
    constructor() {
        this.firstNumber = "";
        this.operator = "";
        this.waitingForSecondNumber = false;
        this.historyItems = [];
    }

    addToHistory(item) {
        this.historyItems.push(item);
    }

    clearHistory() {
        this.historyItems = [];
    }

    updateHistoryDisplay() {
        return this.historyItems;
    }

    setFirstNumber(number) {
        this.firstNumber = number;
    }

    setOperator(operator) {
        this.operator = operator;
    }

    setWaitingForSecondNumber(waiting) {
        this.waitingForSecondNumber = waiting;
    }

    calculate(secondNumber) {
        let result;
        switch (this.operator) {
            case "+":
                result = this.firstNumber + secondNumber;
                break;
            case "-":
                result = this.firstNumber - secondNumber;
                break;
            case "x":
                result = this.firstNumber * secondNumber;
                break;
            case "/":
                if (secondNumber === 0) {
                    throw new Error("Division by zero");
                }
                result = this.firstNumber / secondNumber;
                break;
        }
        return result;
    }
}
