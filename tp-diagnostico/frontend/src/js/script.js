const URL = "http://localhost:8080/";

const selectProvincias = document.getElementById("provincias");
const selectDepartamentos = document.getElementById("departamentos");
const selectMunicipios = document.getElementById("municipios");
const selectLocalidades = document.getElementById("localidades");
const pElement = document.getElementById("datos");

const deleteLocalChildren = () => {
    const localidadesChildren = [...selectLocalidades.children];
    if (localidadesChildren.length > 1) {
        localidadesChildren.forEach((i) => {
            if (i.value !== "Localidades") {
                selectLocalidades.removeChild(i);
            }
        });
        selectLocalidades.setAttribute("disabled", true);
    }
};

const deleteMuniChildren = () => {
    const municipiosChildren = [...selectMunicipios.children];
    if (municipiosChildren.length > 1) {
        municipiosChildren.forEach((i) => {
            if (i.value !== "Municipios") {
                selectMunicipios.removeChild(i);
            }
        });
        selectMunicipios.setAttribute("disabled", true);
    }
};

const deleteDeptChildren = () => {
    const departamentosChildren = [...selectDepartamentos.children];
    if (departamentosChildren.length > 1) {
        departamentosChildren.forEach((i) => {
            if (i.value !== "Departamentos") {
                selectDepartamentos.removeChild(i);
            }
        });
    }
};

const handleChangeLocalidad = () => {
    pElement.innerText = selectLocalidades.value;
};

const handleChangeMunicipio = (ev) => {
    ev.preventDefault();
    const idMunicipio = selectMunicipios.value;
    fetch(`${URL}locality/${idMunicipio}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                selectLocalidades.removeAttribute("disabled");
                deleteLocalChildren();
                data.forEach((i) => {
                    const localidadesOptions = document.createElement("option");
                    localidadesOptions.value = JSON.stringify(i);
                    localidadesOptions.innerText = i.name;
                    selectLocalidades.appendChild(localidadesOptions);
                });
                selectLocalidades.addEventListener( "change", handleChangeLocalidad);
            }
        });
};

const handleChangeDepartamento = (ev) => {
    ev.preventDefault();
    const idDepartamento = selectDepartamentos.value;
    console.log(idDepartamento);
    fetch(`${URL}municipality/${idDepartamento}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                selectMunicipios.removeAttribute("disabled");
                deleteLocalChildren();
                deleteMuniChildren();
                data.forEach((i) => {
                    const municipiosOptions = document.createElement("option");
                    municipiosOptions.value = i.id;
                    municipiosOptions.innerText = i.name;
                    selectMunicipios.appendChild(municipiosOptions);
                });
                selectMunicipios.addEventListener( "change", handleChangeMunicipio);
            }
        });
};

const handleChangeProvincia = (ev) => {
    const idProvincia = selectProvincias.value;
    fetch(`${URL}department/${idProvincia}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                selectDepartamentos.removeAttribute("disabled");
                deleteLocalChildren();
                deleteMuniChildren();
                deleteDeptChildren();
                data.forEach((i) => {
                    const departamentosOptions =
                        document.createElement("option");
                    departamentosOptions.value = i.id;
                    departamentosOptions.innerText = i.name;
                    selectDepartamentos.appendChild(departamentosOptions);
                });
                selectDepartamentos.addEventListener( "change", handleChangeDepartamento);
            }
        });
};

const handleOnLoad = () => {
    fetch(URL + "loadData").then((response) => {
        if (response.status === 409) {
            alert(JSON.stringify(response));
            return;
        }
        fetch(`${URL}provinces`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.length > 0) {
                    selectProvincias.removeAttribute("disabled");
                    data.forEach((i) => {
                        const provinciasOptions =
                            document.createElement("option");
                        provinciasOptions.value = i.id;
                        provinciasOptions.innerText = i.name;
                        selectProvincias.appendChild(provinciasOptions);
                    });
                    selectProvincias.addEventListener( "change", handleChangeProvincia);
                }
            });
    });
};
