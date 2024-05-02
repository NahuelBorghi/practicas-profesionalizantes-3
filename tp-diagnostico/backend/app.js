const express = require("express");
const cors = require("cors");
const { createConnection } = require("mysql2/promise");
const loadData = require("./loadData");

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

// Conexión a la base de datos
const env = {
    "host": process.env.DATABASE_HOST || "db",
    "user": process.env.DATABASE_USER || "root",
    "password": process.env.MYSQL_ROOT_PASSWORD || "",
    "database": process.env.MYSQL_DATABASE || "diagnostico",
};

// ------------------------------------ provinces ------------------------------------
// Ruta para obtener todas las provinces
app.get("/provinces", async (req, res) => {
  try {
      const db = await createConnection(env);
      const [provincias] = await db.execute(
          "SELECT * FROM Provinces",
          []
      );
      db.end();
      res.status(200).send(provincias);
  } catch (error) {
      console.log("error", error);
      res.status(409).send({ message: error });
  }
});

// ------------------------------------ departments ------------------------------------
// Ruta para obtener todas las departments
app.get("/departments", async (req, res) => {
  try {
      const db = await createConnection(env);
      const [provincias] = await db.execute("SELECT * FROM Departments", []);
      db.end();
      res.status(200).send(provincias);
  } catch (error) {
      console.log("error", error);
      res.status(409).send({ message: error });
  }
});
// Ruta para obtener un departamento por ID de provincia
app.get("/department/:id", async (req, res) => {
  try {
      const db = await createConnection(env);
      const idProvince = req.params["id"];
      const [department] = await db.execute(
          "SELECT * FROM Departments WHERE idProvince = (?)",
          [idProvince]
      );
      db.end();
      res.status(200).send(department);
  } catch (error) {
      console.log("error", error);
      return [{ data: "error", message: error }];
  }
});

// ------------------------------------ municipalities ------------------------------------
// Ruta para obtener todas las municipalities
app.get("/municipalities", async (req, res) => {
  try {
      const db = await createConnection(env);
      const [provincias] = await db.execute("SELECT * FROM Municipalities", []);
      db.end();
      res.status(200).send(provincias);
  } catch (error) {
      console.log("error", error);
      res.status(409).send({ message: error });
  }
});
// Ruta para obtener un municipio por ID de departamento
app.get("/municipality/:id", async (req, res) => {
  try {
      const db = await createConnection(env);
      const idDepartment = req.params["id"];
      const [municipality] = await db.execute(
          "SELECT * FROM Municipalities WHERE idDepartment = (?)",
          [idDepartment]
      );
      db.end();
      res.status(200).send(municipality);
  } catch (error) {
      console.log("error", error);
      return [{ data: "error", message: error }];
  }
});

// ------------------------------------ localities ------------------------------------
// Ruta para obtener todas las localities
app.get("/localities", async (req, res) => {
  try {
      const db = await createConnection(env);
      const [provincias] = await db.execute("SELECT * FROM Localities", []);
      db.end();
      res.status(200).send(provincias);
  } catch (error) {
      console.log("error", error);
      res.status(409).send({ message: error });
  }
});
// Ruta para obtener una localidad por ID de municipio
app.get("/locality/:id", async (req, res) => {
  try {
      const db = await createConnection(env);
      const idMunicipality = req.params["id"];
      const [locality] = await db.execute(
          "SELECT * FROM Localities WHERE idMunicipality = (?)",
          [idMunicipality]
      );
      db.end();
      res.status(200).send(locality);
  } catch (error) {
      console.log("error", error);
      return [{ data: "error", message: error }];
  }
});

// ------------------------------------ loadData ------------------------------------
app.get("/loadData", loadData);


app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
