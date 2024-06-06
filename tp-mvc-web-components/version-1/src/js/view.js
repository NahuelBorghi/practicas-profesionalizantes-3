// src/js/view.js
export class CalculatorView extends HTMLElement {
    constructor() {
        super();

        // Modelo de la calculadora
        this.model = null;

        // Crear elementos del DOM
        this.container = document.createElement("div");

        this.display = document.createElement("input");
        this.display.className = "displayResult";
        this.display.id = "display";
        this.display.type = "text";
        this.display.value = "";
        this.display.disabled = true;

        this.table = document.createElement("table");
        this.table.id = "calculatorTable";

        // Crear botones y asignarles atributos y eventos
        this.buttons = [
            ["7", "8", "9", "+"],
            ["4", "5", "6", "-"],
            ["3", "2", "1", "x"],
            ["0", ".", "=", "/"],
        ];

        this.clearButton = document.createElement("button");
        this.clearButton.innerHTML = "BORRAR";
        this.clearButton.id = "buttonClear";
        this.clearButton.className = "clearButton";
        this.clearButton.onclick = () =>
            this.handleButtonClick(this.clearButton.innerHTML);

        // Contenedor de historial
        this.historyDiv = document.createElement("div");
        this.historyDiv.id = "history";

        // Crear tabla y añadirle las filas y celdas con botones
        this.table.appendChild(this.createDisplayRow());
        this.buttons.forEach((row) =>
            this.table.appendChild(this.createButtonRow(row))
        );
        this.table.appendChild(this.createClearButtonRow());

        // Añadir elementos al contenedor principal
        this.container.appendChild(this.table);
        this.container.appendChild(this.historyDiv);
        this.appendChild(this.container);
    }

    createDisplayRow() {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.appendChild(this.display);
        row.appendChild(cell);
        return row;
    }

    createButtonRow(buttonValues) {
        const row = document.createElement("tr");
        buttonValues.forEach((value) => {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.innerHTML = value;
            button.className = isNaN(value) ? "operatorButton" : "numberButton";
            button.onclick = () => this.handleButtonClick(value);
            cell.appendChild(button);
            row.appendChild(cell);
        });
        return row;
    }

    createClearButtonRow() {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.appendChild(this.clearButton);
        row.appendChild(cell);
        return row;
    }

    handleButtonClick(value) {
        if (this.controller) {
            this.controller.handleButtonClick(value);
        }
    }

    updateDisplay(value) {
        this.display.value = value;
    }

    updateHistory(historyItems) {
        this.historyDiv.innerHTML = "";
        historyItems.forEach((item) => {
            const historyItemElement = document.createElement("div");
            historyItemElement.classList.add("history-item");
            historyItemElement.textContent = item;
            this.historyDiv.prepend(historyItemElement);
        });
    }

    connectedCallback() {
        // Código para ejecutar cuando el componente está conectado al DOM
    }

    disconnectedCallback() {
        // Código para ejecutar cuando el componente está desconectado del DOM
    }
}

customElements.define("calculator-view", CalculatorView);
