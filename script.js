const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id') || "001";
const MASTER_KEY = "$2a$10$RA2b3dfFoTrdqkpHH7uVkedzDc3OSmOTSLuvKFx7n4hRCONPqti9S";

async function cargarDatosAlumno() {
    try {
        const responseMapa = await fetch('mapeo_bins.json');
        const mapeoBins = await responseMapa.json();
        const binIdAsignado = mapeoBins[studentId];

        if (!binIdAsignado) {
            console.warn("El ID consultado no está registrado en el mapeo.");
            return;
        }

        const responseBin = await fetch(`https://api.jsonbin.io/v3/b/${binIdAsignado}/latest`, {
            headers: { "X-Master-Key": MASTER_KEY }
        });

        const resultado = await responseBin.json();
        const perfilesBloque = resultado.record.profiles || {};
        const datosAlumno = perfilesBloque[studentId];

        if (datosAlumno) {
            if(document.getElementById('nombre')) document.getElementById('nombre').innerText = datosAlumno.nombre || "";
            if(document.getElementById('telefono')) document.getElementById('telefono').innerText = datosAlumno.telefono || "";
            if(document.getElementById('foto') && datosAlumno.foto) {
                document.getElementById('foto').src = datosAlumno.foto;
            }
            console.log("Datos cargados correctamente.");
        }
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

async function guardarDatosAlumno(nombre, telefono, fotoBase64) {
    try {
        const responseMapa = await fetch('mapeo_bins.json');
        const mapeoBins = await responseMapa.json();
        const binIdAsignado = mapeoBins[studentId];

        if (!binIdAsignado) {
            alert("Error: ID no encontrado en el sistema.");
            return;
        }

        const responseGet = await fetch(`https://api.jsonbin.io/v3/b/${binIdAsignado}/latest`, {
            headers: { "X-Master-Key": MASTER_KEY }
        });
        const actualData = await responseGet.json();
        let perfilesBloque = actualData.record.profiles || {};

        perfilesBloque[studentId] = {
            nombre: nombre,
            telefono: telefono,
            foto: fotoBase64
        };

        const responsePut = await fetch(`https://api.jsonbin.io/v3/b/${binIdAsignado}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": MASTER_KEY
            },
            body: JSON.stringify({
                profiles: perfilesBloque,
                bloque: `Actualización para ID ${studentId}`
            })
        });

        if (responsePut.ok) {
            alert("¡Guardado correctamente en la nube!");
        } else {
            alert("Error al guardar los cambios.");
        }
    } catch (error) {
        console.error("Error en la operación:", error);
    }
}

window.onload = () => {
    cargarDatosAlumno();
};
