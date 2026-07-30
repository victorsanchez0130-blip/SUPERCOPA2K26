const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Archivo de almacenamiento persistente en disco
const DATA_FILE = path.join(__dirname, 'data.json');

// Datos iniciales que se cargarán SOLO la primera vez si data.json no existe
const datosIniciales = {
    concursos: [
        { id: "c1",  lugar: "VALLE",         colegio: "I.E. RINCONADA",                   docente: "Favio Mendez",     fechaTxt: "19 de Julio, 2026",        fechaISO: "2026-07-19T09:00:00", logo: "rinconada.png",             estado: "finalizado" },
        { id: "c2",  lugar: "SANTA",         colegio: "I.E.P. G.M.L.J. ORBEGOSO",         docente: "Erik Obando",      fechaTxt: "23 de Agosto, 2026",       fechaISO: "2026-08-23T09:00:00", logo: "orbegoso.png",              estado: "pendiente" },
        { id: "c3",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. ABELARDO QUIÑONES",           docente: "Ernesto Lomparte", fechaTxt: "29 de Agosto, 2026",       fechaISO: "2026-08-29T09:00:00", logo: "quinones.png",              estado: "pendiente" },
        { id: "c4",  lugar: "NUEVO CHIMBOTE",colegio: "I.E.P. EL SEÑOR ES MI PASTOR",     docente: "Erik Obando",      fechaTxt: "20 de Septiembre, 2026",   fechaISO: "2026-09-20T09:00:00", logo: "pastor.png",                estado: "pendiente" },
        { id: "c5",  lugar: "CASMA",         colegio: "I.E. REPÚBLICA DE CHILE",          docente: "Ernesto Lomparte", fechaTxt: "26 de Septiembre, 2026",   fechaISO: "2026-09-26T09:00:00", logo: "chile.png",                 estado: "pendiente" },
        { id: "c6",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. REPÚBLICA ARGENTINA",         docente: "Juan Pablo",       fechaTxt: "03 de Octubre, 2026",      fechaISO: "2026-10-03T09:00:00", logo: "argentina.png",             estado: "pendiente" },
        { id: "c7",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. EXPERIMENTAL UNS",            docente: "Jose Galvez",      fechaTxt: "10 de Octubre, 2026",      fechaISO: "2026-10-10T09:00:00", logo: "experimental.png",          estado: "pendiente" },
        { id: "c8",  lugar: "CHIMBOTE",      colegio: "I.E. GLORIOSA 329",                docente: "Miguel Mondoñedo", fechaTxt: "17 de Octubre, 2026",      fechaISO: "2026-10-17T09:00:00", logo: "gloriosa.png",              estado: "pendiente" },
        { id: "c9",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. YUGOSLAVO",                   docente: "Esteban Salas",    fechaTxt: "24 de Octubre, 2026",      fechaISO: "2026-10-24T09:00:00", logo: "yugoslavo.png",             estado: "pendiente" },
        { id: "c10", lugar: "CHIMBOTE",      colegio: "I.E. JOSÉ GÁLVEZ",                 docente: "Luis Monzón",      fechaTxt: "31 de Octubre, 2026",      fechaISO: "2026-10-31T09:00:00", logo: "josegalvez.png",            estado: "pendiente" },
        { id: "c11", lugar: "NUEVO CHIMBOTE",colegio: "I.E. PEDRO PABLO ATUSPARIA",       docente: "Juan Pablo",       fechaTxt: "07 de Noviembre, 2026",    fechaISO: "2026-11-07T09:00:00", logo: "atusparia.png",             estado: "pendiente" },
        { id: "c12", lugar: "SAN JACINTO",   colegio: "I.E.P. SAN FELIPE",                docente: "Boris Montero",    fechaTxt: "14 de Noviembre, 2026",    fechaISO: "2026-11-14T09:00:00", logo: "sanfelipe.png",             estado: "pendiente" },
        { id: "c13", lugar: "SAN JACINTO",   colegio: "I.E. SAN JACINTO",                 docente: "Miguel Mondoñedo", fechaTxt: "22 de Noviembre, 2026",    fechaISO: "2026-11-22T09:00:00", logo: "sanjacinto.png",            estado: "pendiente" },
        { id: "c14", lugar: "CHIMBOTE",      colegio: "I.E. EX 314",                      docente: "Erik Obando",      fechaTxt: "05 de Diciembre, 2026",    fechaISO: "2026-12-05T09:00:00", logo: "ex314.png",                 estado: "pendiente" },
        { id: "c15", lugar: "COISHCO",       colegio: "I.E.P. JEAN PIAGET",               docente: "Victor Sanchez",   fechaTxt: "12 de Diciembre, 2026",    fechaISO: "2026-12-12T09:00:00", logo: "jeanpiaget.png",            estado: "pendiente" }
    ],
    colegios: [
        { id: "C001", nombre: "I.E. EXPERIMENTAL UNS", cat: "A", logo: "experimental.png", resultados: {} },
        { id: "C002", nombre: "I.E. GLORIOSA 329", cat: "A", logo: "gloriosa.png", resultados: {} },
        { id: "C003", nombre: "I.E. JOSÉ GÁLVEZ", cat: "A", logo: "josegalvez.png", resultados: {} },
        { id: "C004", nombre: "I.E. REPÚBLICA ARGENTINA", cat: "A", logo: "argentina.png", resultados: {} },
        { id: "C005", nombre: "I.E. PEDRO PABLO ATUSPARIA", cat: "A", logo: "atusparia.png", resultados: {} },
        { id: "C006", nombre: "I.E. REPÚBLICA DE CHILE", cat: "A", logo: "chile.png", resultados: {} },
        { id: "C007", nombre: "I.E. SAN JACINTO", cat: "A", logo: "sanjacinto.png", resultados: {} },
        { id: "C008", nombre: "I.E.P. EL SEÑOR ES MI PASTOR", cat: "A", logo: "pastor.png", resultados: {} },
        { id: "C009", nombre: "I.E.P. G.M.L.J. ORBEGOSO", cat: "A", logo: "orbegoso.png", resultados: {} },
        { id: "C010", nombre: "I.E. ABELARDO QUIÑONES", cat: "B", logo: "quinones.png", resultados: {} },
        { id: "C011", nombre: "I.E. CONSTRUCTORES DEL SABER", cat: "B", logo: "constructores.png", resultados: {} },
        { id: "C012", nombre: "I.E. LA HUACA", cat: "B", logo: "lahuaca.png", resultados: {} },
        { id: "C013", nombre: "I.E. LAS BRISAS", cat: "B", logo: "lasbrisas.png", resultados: {} },
        { id: "C014", nombre: "I.E. RINCONADA", cat: "B", logo: "rinconada.png", resultados: {} },
        { id: "C015", nombre: "I.E. YUGOSLAVO", cat: "B", logo: "yugoslavo.png", resultados: {} },
        { id: "C016", nombre: "I.E.P. SANTA TERESITA DE JESÚS", cat: "B", logo: "stj.png", resultados: {} },
        { id: "C017", nombre: "I.E.P. JEAN PIAGET", cat: "B", logo: "jeanpiaget.png", resultados: {} },
        { id: "C018", nombre: "I.E.P. SAN FELIPE", cat: "B", logo: "sanfelipe.png", resultados: {} },
        { id: "C019", nombre: "I.E.P. SANTA TERESITA", cat: "B", logo: "santateresita.png", resultados: {} },
        { id: "C020", nombre: "I.E. ANDRÉS AVELINO CÁCERES", cat: "B", logo: "avelino.png", resultados: {} },
        { id: "C021", nombre: "I.E.P. SCHOOL KINDER KING", cat: "B", logo: "orbegoso.png", resultados: {} },
        { id: "C022", nombre: "I.E. EX 314", cat: "PRIMARIA", logo: "ex314.png", resultados: {} }
    ]
};

// Función para obtener siempre la última versión guardada desde el archivo
function obtenerDatosGuardados() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const contenido = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(contenido);
        }
    } catch (e) {
        console.error("Error leyendo data.json:", e);
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(datosIniciales, null, 2));
    return datosIniciales;
}

let appState = obtenerDatosGuardados();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/logos', express.static(path.join(__dirname, 'public', 'logos')));

const usuariosRegistrados = [
    { usuario: "Jhon", pass: "123456", nombre: "Jhon Cristopher Alvarado Ruiz", rol: "Fundador" },
    { usuario: "Victor", pass: "12542563", nombre: "Victor Sánchez Vera", rol: "Editor" }
];

app.post('/api/login', (req, res) => {
    const { usuario, pass } = req.body;
    const user = usuariosRegistrados.find(
        u => u.usuario.toLowerCase() === usuario.toLowerCase() && u.pass === pass
    );

    if (user) {
        res.json({ ok: true, usuario: { nombre: user.nombre, rol: user.rol } });
    } else {
        res.status(401).json({ ok: false, message: "Usuario o contraseña incorrectos" });
    }
});

app.get('/api/datos', (req, res) => {
    appState = obtenerDatosGuardados();
    res.json({ concursos: appState.concursos, colegios: appState.colegios });
});

app.post('/api/guardar', (req, res) => {
    const { concursos, colegios, userRole } = req.body;

    if (userRole !== 'Fundador') {
        return res.status(403).json({ ok: false, message: "Acceso denegado: Se requiere rol de FUNDADOR" });
    }

    if (concursos) appState.concursos = concursos;
    if (colegios) appState.colegios = colegios;

    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(appState, null, 2));
        res.json({ ok: true, message: "Datos guardados de forma permanente." });
    } catch (err) {
        console.error("Error al escribir en data.json:", err);
        res.status(500).json({ ok: false, message: "Error al escribir en disco." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
