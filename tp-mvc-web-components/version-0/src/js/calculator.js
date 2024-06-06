let firstNumber = "";
let operator = "";
let waitingForSecondNumber = false;
let historyItems = [];

function addToHistory(item) {
    historyItems.push(item);
    updateHistoryDisplay();
}

function clearHistory() {historyItems = [];}


function updateHistoryDisplay() {
    const historyElement = document.getElementById("history");
    historyElement.innerHTML = ""; 

    for (const item of historyItems) {
        const historyItemElement = document.createElement("div");
        historyItemElement.classList.add("history-item");
        historyItemElement.textContent = item;
        historyElement.prepend(historyItemElement);
    }
}

function updateDisplay(value) {
    const display = document.getElementById("display");
    display.value = value;
}


function handleClick(event) {
    const value = event.target.innerText;

    if (!isNaN(value)) {
        if (waitingForSecondNumber) {
            updateDisplay(value);
            waitingForSecondNumber = false;
        } else {
            updateDisplay(display.value + value);
        }
    } else if (value === ".") {
        if (!display.value.includes(".")) {
            updateDisplay(display.value + value);
        }
    } else if (value === "BORRAR") {
        updateDisplay("");
        firstNumber = "";
        operator = "";
        waitingForSecondNumber = false;
    } else if (
        value === "+" ||
        value === "-" ||
        value === "x" ||
        value === "/"
    ) {
        firstNumber = parseFloat(display.value);
        addToHistory(firstNumber);
        addToHistory(value);
        operator = value;
        updateDisplay("");
        waitingForSecondNumber = true;
    } else if (value === "=") {
        if (operator === "") {
            return;
        }

        const secondNumber = parseFloat(display.value);
        addToHistory(secondNumber);
        let result;

        switch (operator) {
            case "+":
                result = firstNumber + secondNumber;
                break;
            case "-":
                result = firstNumber - secondNumber;
                break;
            case "x":
                result = firstNumber * secondNumber;
                break;
            case "/":
                if (secondNumber === 0) {
                    alert("Error: Division by zero");
                    return;
                }
                result = firstNumber / secondNumber;
                break;
        }

        updateDisplay(result);
        firstNumber = result;
        operator = "";
        waitingForSecondNumber = false;

        addToHistory("=");
        addToHistory(result);
    }
}

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => button.addEventListener("click", handleClick));
