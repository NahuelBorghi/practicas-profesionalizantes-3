const xlsx = require("xlsx");
const { createConnection } = require("mysql2/promise");

const env = {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.MYSQL_ROOT_PASSWORD || "matiasGASTONsantiago",
    database: process.env.MYSQL_DATABASE || "diagnostico",
};
const loadData = async (req, res) => {
    try {
        const db = await createConnection(env);
        const [provincias] = await db.execute("SELECT * FROM Provinces", []);
        const [departamentos] = await db.execute("SELECT * FROM Departments",[]);
        const [municipios] = await db.execute("SELECT * FROM Municipalities",[]);
        const [localidades] = await db.execute("SELECT * FROM Localities", []);

        const data = xlsx.readFile("./Localidades.xlsx");
        const firstSheetName = data.SheetNames[0];
        const worksheet = data.Sheets[firstSheetName];
        const excelData = xlsx.utils.sheet_to_json(worksheet);

        if (provincias.length === 0) {
            const provinciaName = excelData.map((i) => {
                return i.Provincia;
            });
            const provinciaNameFormatted = provinciaName.filter(
                (value, index, self) => {
                    return self.indexOf(value) === index;
                }
            );
            provinciaNameFormatted.forEach(async (name) => {
                try {
                    await db.execute(
                        "INSERT INTO Provinces (name) VALUES (?)",
                        [name]
                    );
                } catch (error) {
                    console.log("error", error);
                }
            });
        }

        if (departamentos.length === 0) {
            const [provincias] = await db.execute("SELECT * FROM Provinces", []);
            const departamentos = [];
            excelData.forEach((data) => {
                const provincia = provincias.find((provincias) => {
                    return provincias.name === data.Provincia;
                });
                if (provincia) {
                    departamentos.push({
                        name: data.Departamento,
                        idProvincia: provincia.id,
                    });
                }
            });
            const departamentosFormatted = departamentos.reduce(
                (accumulator, currentValue) => {
                    let existingItem = accumulator.find(
                        (item) => item.name === currentValue.name
                    );
                    if (!existingItem) {
                        accumulator.push(currentValue);
                    }
                    return accumulator;
                },
                []
            );
            departamentosFormatted.forEach(async (i) => {
                try {
                    await db.execute(
                        "INSERT INTO Departments (name, idProvince) VALUES (?, ?)",
                        [i.name, i.idProvincia]
                    );
                } catch (error) {
                    console.log("error", error);
                }
            });
        }

        if (municipios.length === 0) {
            const [departamentos] = await db.execute("SELECT * FROM Departments", []);
            const municipios = [];
            excelData.forEach((data) => {
                const departamento = departamentos.find((i) => {
                    return i.name === data.Departamento;
                });
                if (departamento) {
                    municipios.push({
                        name: data.Municipio,
                        idDepartment: departamento.id,
                    });
                }
            });
            const municipiosFormatted = municipios.reduce(
                (accumulator, currentValue) => {
                    let existingItem = accumulator.find(
                        (item) => item.name === currentValue.name
                    );
                    if (!existingItem) {
                        accumulator.push(currentValue);
                    }
                    return accumulator;
                },
                []
            );
            municipiosFormatted.forEach(async (i) => {
                try {
                    await db.execute(
                        "INSERT INTO Municipalities (name, idDepartment) VALUES (?, ?)",
                        [i.name, i.idDepartment]
                    );
                } catch (error) {
                    console.log("error", error);
                }
            });
        }

        if (localidades.length === 0) {
            const [municipios] = await db.execute("SELECT * FROM Municipalities", []);
            const localidadesArr = [];
            excelData.forEach((data) => {
                const municipio = municipios.find((i) => {
                    return i.name === data.Municipio;
                });
                if (municipio) {
                    localidadesArr.push({
                        name: data.Municipio,
                        idMunicipality: municipio.id,
                        latitud: data.Latitud,
                        longitud: data.Longitud,
                    });
                }
            });
            const localidadFormatted = localidadesArr.reduce(
                (accumulator, currentValue) => {
                    let existingItem = accumulator.find(
                        (item) => item.name === currentValue.name
                    );
                    if (!existingItem) {
                        accumulator.push(currentValue);
                    }
                    return accumulator;
                },
                []
            );
            localidadFormatted.forEach(async (i) => {
                try {
                    await db.execute(
                        "INSERT INTO Localities (name, latitud, longitud, idMunicipality) VALUES (?, ?, ?, ?)",
                        [i.name, i.latitud, i.longitud, i.idMunicipality]
                    );
                } catch (error) {
                    console.log("error", error);
                }
            });
        }

        db.end();
        res.status(200).send({ data: [] });
    } catch (error) {
        console.log("error", error);
        res.status(409).send({ data: "error", message: error });
    }
};

module.exports = loadData;