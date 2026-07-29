const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir la carpeta estática del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos de Usuarios
let usuariosRegistrados = [
    { usuario: "jhon", pass: "123456", nombre: "Jhon Cristopher Alvarado Ruiz", rol: "creador" },
    { usuario: "orbegoso", pass: "docente1", nombre: "Docente: Gran Mariscal Orbegoso", rol: "docente" },
    { usuario: "quinones", pass: "docente2", nombre: "Docente: José Abelardo Quiñones", rol: "docente" }
];

// Base de datos de Concursos
let concursosGlobales = [
    { id: "c1",  lugar: "VALLE",         colegio: "I.E. RINCONADA",                   docente: "Favio Mendez",     fechaTxt: "19 de Julio, 2026",        fechaISO: "2026-07-19T09:00:00", logo: "rinconada.png",             estado: "finalizado" },
    { id: "c2",  lugar: "SANTA",         colegio: "I.E.P. G.M.L.J. ORBEGOSO",         docente: "Erik Obando",      fechaTxt: "23 de Agosto, 2026",       fechaISO: "2026-08-23T09:00:00", logo: "orbegoso.png",              estado: "pendiente" },
    { id: "c3",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. ABELARDO QUIÑONES",           docente: "Ernesto Lomparte", fechaTxt: "29 de Agosto, 2026",       fechaISO: "2026-08-29T09:00:00", logo: "quinones.png",              estado: "pendiente" },
    { id: "c4",  lugar: "NUEVO CHIMBOTE",colegio: "I.E.P. EL SEÑOR ES MI PASTOR",    docente: "Erik Obando",      fechaTxt: "20 de Septiembre, 2026",   fechaISO: "2026-09-20T09:00:00", logo: "pastor.png",                estado: "pendiente" },
    { id: "c5",  lugar: "CASMA",         colegio: "I.E. REPÚBLICA DE CHILE",          docente: "Ernesto Lomparte", fechaTxt: "26 de Septiembre, 2026",   fechaISO: "2026-09-26T09:00:00", logo: "chile.png",                 estado: "pendiente" },
    { id: "c6",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. REPÚBLICA ARGENTINA",        docente: "Juan Pablo",       fechaTxt: "03 de Octubre, 2026",      fechaISO: "2026-10-03T09:00:00", logo: "republicaargentina.png",   estado: "pendiente" },
    { id: "c7",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. EXPERIMENTAL UNS",            docente: "Jose Galvez",      fechaTxt: "10 de Octubre, 2026",      fechaISO: "2026-10-10T09:00:00", logo: "experimentaluns.png",    estado: "pendiente" },
    { id: "c8",  lugar: "CHIMBOTE",      colegio: "I.E. GLORIOSA 329",                docente: "Miguel Mondoñedo", fechaTxt: "17 de Octubre, 2026",      fechaISO: "2026-10-17T09:00:00", logo: "gloriosa329.png",          estado: "pendiente" },
    { id: "c9",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. YUGOSLAVO",                   docente: "Esteban Salas",    fechaTxt: "24 de Octubre, 2026",      fechaISO: "2026-10-24T09:00:00", logo: "yugoslavo.png",             estado: "pendiente" },
    { id: "c10", lugar: "CHIMBOTE",      colegio: "I.E. JOSÉ GÁLVEZ",                 docente: "Luis Monzón",      fechaTxt: "31 de Octubre, 2026",      fechaISO: "2026-10-31T09:00:00", logo: "josegalvez.png",           estado: "pendiente" },
    { id: "c11", lugar: "NUEVO CHIMBOTE",colegio: "I.E. PEDRO PABLO ATUSPARIA",       docente: "Juan Pablo",       fechaTxt: "07 de Noviembre, 2026",    fechaISO: "2026-11-07T09:00:00", logo: "atusparia.png",              estado: "pendiente" },
    { id: "c12", lugar: "SAN JACINTO",   colegio: "I.E.P. SAN FELIPE",                docente: "Boris Montero",    fechaTxt: "14 de Noviembre, 2026",    fechaISO: "2026-11-14T09:00:00", logo: "sanfelipe.png",             estado: "pendiente" },
    { id: "c13", lugar: "SAN JACINTO",   colegio: "I.E. SAN JACINTO",                 docente: "Miguel Mondoñedo", fechaTxt: "22 de Noviembre, 2026",    fechaISO: "2026-11-22T09:00:00", logo: "sanjacinto.png",            estado: "pendiente" },
    { id: "c14", lugar: "CHIMBOTE",      colegio: "I.E. EX 314",                      docente: "Erik Obando",      fechaTxt: "05 de Diciembre, 2026",    fechaISO: "2026-12-05T09:00:00", logo: "ex314.png",                estado: "pendiente" },
    { id: "c15", lugar: "COISHCO",       colegio: "I.E.P. JEAN PIAGET",               docente: "Victor Sanchez",   fechaTxt: "12 de Diciembre, 2026",    fechaISO: "2026-12-12T09:00:00", logo: "jeanpiaget.png",            estado: "pendiente" }
];

// Base de datos de Colegios
let colegiosGlobales = [
    { id: "C001", nombre: "I.E. EXPERIMENTAL UNS", cat: "A", logo: "experimentaluns.png", resultados: { "c1": 4 } },
    { id: "C002", nombre: "I.E. GLORIOSA 329", cat: "A", logo: "gloriosa329.png", resultados: { "c1": 3 } },
    { id: "C003", nombre: "I.E. JOSÉ GÁLVEZ", cat: "A", logo: "josegalvez.png", resultados: { "c1": 2 } },
    { id: "C004", nombre: "I.E. REPÚBLICA ARGENTINA", cat: "A", logo: "republicaargentina.png", resultados: { "c1": 1 } },
    { id: "C005", nombre: "I.E. PEDRO PABLO ATUSPARIA", cat: "A", logo: "atusparia.png", resultados: {} },
    { id: "C006", nombre: "I.E. REPÚBLICA DE CHILE", cat: "A", logo: "chile.png", resultados: {} },
    { id: "C007", nombre: "I.E. SAN JACINTO", cat: "A", logo: "sanjacinto.png", resultados: {} },
    { id: "C008", nombre: "I.E.P. EL SEÑOR ES MI PASTOR", cat: "A", logo: "pastor.png", resultados: {} },
    { id: "C009", nombre: "I.E.P. G.M.L.J. ORBEGOSO", cat: "A", logo: "orbegoso.png", resultados: {} },
    { id: "C010", nombre: "I.E. ABELARDO QUIÑONES", cat: "B", logo: "quinones.png", resultados: {} },
    { id: "C011", nombre: "I.E. CONSTRUCTORES DEL SABER", cat: "B", logo: "constructoressaber.png", resultados: {} },
    { id: "C012", nombre: "I.E. LA HUACA", cat: "B", logo: "lahuaca.png", resultados: {} },
    { id: "C013", nombre: "I.E. LAS BRISAS", cat: "B", logo: "lasbrisas.png", resultados: {} },
    { id: "C014", nombre: "I.E. RINCONADA", cat: "B", logo: "rinconada.png", resultados: {} },
    { id: "C015", nombre: "I.E. YUGOSLAVO", cat: "B", logo: "yugoslavo.png", resultados: {} },
    { id: "C016", nombre: "I.E.P. SANTA TERESITA DE JESÚS", cat: "B", logo: "santa_teresita_jesus.png", resultados: {} },
    { id: "C017", nombre: "I.E.P. JEAN PIAGET", cat: "B", logo: "jeanpiaget.png", resultados: {} },
    { id: "C018", nombre: "I.E.P. SAN FELIPE", cat: "B", logo: "sanfelipe.png", resultados: {} },
    { id: "C019", nombre: "I.E.P. SANTA TERESITA", cat: "B", logo: "santateresita.png", resultados: {} },
    { id: "C020", nombre: "I.E. ANDRÉS AVELINO CÁCERES", cat: "B", logo: "avelinocaceres.png", resultados: {} },
    { id: "C021", nombre: "I.E.P. SCHOOL KINDER KING", cat: "B", logo: "orbegoso.png", resultados: { "c1": 4 } },
    { id: "C022", nombre: "I.E. EX 314", cat: "PRIMARIA", logo: "ex314.png", resultados: { "c1": 4 } }
];

// API: Autenticación de Usuarios
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

// API: Obtener Datos de Estado
app.get('/api/datos', (req, res) => {
    res.json({ concursos: concursosGlobales, colegios: colegiosGlobales });
});

// API: Guardar Cambios Realizados por el Creador
app.post('/api/guardar', (req, res) => {
    const { concursos, colegios, userRole } = req.body;

    if (userRole !== 'creador') {
        return res.status(403).json({ ok: false, message: "Acceso denegado: Se requiere rol de CREADOR" });
    }

    if (concursos) concursosGlobales = concursos;
    if (colegios) colegiosGlobales = colegios;

    res.json({ ok: true, message: "Datos guardados correctamente en Railway" });
});

// Ruta Catch-all para la SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
