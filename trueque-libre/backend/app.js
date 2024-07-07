const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8080;

app.use("/", routes);

app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});
