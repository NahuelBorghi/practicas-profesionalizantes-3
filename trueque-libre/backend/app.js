const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8080;

// Conexión a la base de datos
const env = {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.MYSQL_ROOT_PASSWORD || "matiasGASTONsantiago",
    database: process.env.MYSQL_DATABASE || "diagnostico",
};

// usar routes para las rutas de la API
app.use("/AccountList", routes);


app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});
