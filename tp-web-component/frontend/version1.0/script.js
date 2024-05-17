class ListCrudComponent extends HTMLElement{
    constructor() {
        super();
        this.list = [];

        this.container = document.createElement("div");

        this.tittle = document.createElement("h1");
        this.tittle.innerHTML = "gestion de cuentas";

        this.buttonsDiv = document.createElement("div");
        this.subtitle1 = document.createElement("h2");
        this.subtitle1.innerHTML = "seleccione una accion";
        this.listButton = document.createElement("button");
        this.listButton.innerHTML = "Listar";
        this.listButton.id = "listButton";
        this.listButton.onclick = () => {}; //reemplazar por una función definida
        this.createButton = document.createElement("button");
        this.createButton.innerHTML = "Crear";
        this.createButton.id = "createButton";
        this.createButton.onclick = () => {}; //reemplazar por una función definida
        this.updateButton = document.createElement("button");
        this.updateButton.innerHTML = "Editar";
        this.updateButton.id = "updateButton";
        this.updateButton.onclick = () => {}; //reemplazar por una función definida
        this.deleteButton = document.createElement("button");
        this.deleteButton.innerHTML = "Eliminar";
        this.deleteButton.id = "deleteButton";
        this.deleteButton.onclick = () => {}; //reemplazar por una función definida
        this.extraButton = document.createElement("button");
        this.extraButton.innerHTML = "...";
        this.extraButton.id = "extraButton";
        this.extraButton.onclick = () => {}; //reemplazar por una función definida

        this.listDiv = document.createElement("div");
        this.subtitle2 = document.createElement("h2");
        this.subtitle2.innerHTML = "listado de cuentas";
        this.listTable = document.createElement("table");
        this.tablehead = this.listTable.createTHead();
        this.tableheadRow = this.tablehead.insertRow();
        this.tableheadRow.insertCell().innerHTML = "ID";
        this.tableheadRow.insertCell().innerHTML = "Username";
        this.tableheadRow.insertCell().innerHTML = "Saldo";
        this.listTableBody = this.listTable.createTBody();

        
    }

    connectedCallback() {
        //llenar div de botones
        this.buttonsDiv.appendChild(this.subtitle1);
        this.buttonsDiv.appendChild(this.listButton);
        this.buttonsDiv.appendChild(this.createButton);
        this.buttonsDiv.appendChild(this.updateButton);
        this.buttonsDiv.appendChild(this.deleteButton);
        this.buttonsDiv.appendChild(this.extraButton);

        //llenar div de listado
        this.listDiv.appendChild(this.subtitle2);
        this.listDiv.appendChild(this.listTable);

        this.container.appendChild(this.tittle);
        this.container.appendChild(this.buttonsDiv);
        this.container.appendChild(this.listDiv);
        this.appendChild(this.container);
        fetch("http://localhost:8080/accountlist/get")
            .then((response) => response.json())
            .then((data) => {
                this.list = data["cuentas"];
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        this.listButton.onclick = () => {
            this.listTableBody.innerHTML = "";
            this.listar();
        };
        this.createButton.onclick = () => {
            this.create();
        };
        this.updateButton.onclick = () => {
            this.edit();
        };
        this.deleteButton.onclick = () => {
            this.deletear();
        };
    }

    disconnectedCallback() {
        this.listButton.onclick = () => {};
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "list") {
            this.list = JSON.parse(newValue);
        }
    }

    static get observedAttributes() {
        return ["list"];
    }

    listar() {
        this.listTableBody.innerHTML = "";
        this.list.forEach((item) => {
            let row = this.listTableBody.insertRow();
            row.insertCell().innerHTML = item.id;
            row.insertCell().innerHTML = item.username;
            row.insertCell().innerHTML = item.saldo;
        });
    }

    create() {
        const id = prompt("Enter ID:");
        const index = this.list.findIndex((item) => item.id === parseInt(id));
        if (index !== -1) {
            alert("El ID ya existe.");
            console.error("El ID ya existe.");
            return;
        }
        const username = prompt("Enter Username:");
        const saldo = prompt("Enter Saldo:");

        const newItem = {
            id: parseInt(id),
            username: username,
            saldo: saldo,
        };

        this.list.push(newItem);
        console.log(newItem);
        console.log(this.list);
    }

    edit() {
        const id = prompt("Ingrese el ID del elemento a editar:");
        const index = this.list.findIndex((item) => item.id === parseInt(id))
        if (index !== -1) {
            const newUsername = prompt("Ingrese el nuevo nombre de usuario:");
            const newSaldo = prompt("Ingrese el nuevo saldo:");

            if (id && newUsername && newSaldo) {
                this.list[index] = {
                    id: parseInt(id),
                    username: newUsername,
                    saldo: parseFloat(newSaldo),
                };

                this.listTableBody.innerHTML = "";
                this.list.forEach((item) => {
                    let row = this.listTableBody.insertRow();
                    row.insertCell().innerHTML = item.id;
                    row.insertCell().innerHTML = item.username;
                    row.insertCell().innerHTML = item.saldo;
                });

                console.log("Elemento editado con éxito.");
            } else {
                console.error("Error: Debe ingresar todos los datos.");
            }
        } else {
            alert("No se encontró el elemento con el ID:", id);
            console.error("No se encontró el elemento con el ID:", id);
        }
    }

    deletear() {
        const id = prompt("Ingrese el ID del elemento a eliminar:");

        if (id) {
            const index = this.list.findIndex(
                (item) => item.id === parseInt(id)
            );

            if (index !== -1) {
                this.list.splice(index, 1);

                this.listTableBody.innerHTML = "";
                this.list.forEach((item) => {
                    let row = this.listTableBody.insertRow();
                    row.insertCell().innerHTML = item.id;
                    row.insertCell().innerHTML = item.username;
                    row.insertCell().innerHTML = item.saldo;
                });

                console.log("Elemento eliminado con éxito.");
            } else {
                console.error("No se encontró el elemento con el ID:", id);
            }
        } else {
            console.error("Error: Debe ingresar el ID del elemento.");
        }
    }
}

customElements.define("list-crud", ListCrudComponent);

const listCrud = new ListCrudComponent();

document.body.appendChild(listCrud);
