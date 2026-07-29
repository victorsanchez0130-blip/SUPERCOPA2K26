const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del sitio web (HTML, CSS, JS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos temporal en memoria del servidor
let usuariosRegistrados = [
    { usuario: "jhon", pass: "123456", nombre: "Jhon Cristopher Alvarado Ruiz", rol: "creador" },
    { usuario: "orbegoso", pass: "docente1", nombre: "Docente: Gran Mariscal Orbegoso", rol: "docente" },
    { usuario: "quinones", pass: "docente2", nombre: "Docente: José Abelardo Quiñones", rol: "docente" }
];

let concursosGlobales = [
    { id: "c1", lugar: "VALLE", colegio: "I.E. RINCONADA", docente: "Favio Mendez", fechaTxt: "19 de Julio, 2026", fechaISO: "2026-07-19T09:00:00", logo: "rinconada.png", estado: "finalizado" },
    { id: "c2", lugar: "SANTA", colegio: "I.E.P. G.M.L.J. ORBEGOSO", docente: "Erik Obando", fechaTxt: "23 de Agosto, 2026", fechaISO: "2026-08-23T09:00:00", logo: "orbegoso.png", estado: "pendiente" }
];

let colegiosGlobales = [
    { id: "C001", nombre: "I.E. EXPERIMENTAL UNS", cat: "A", logo: "experimentaluns.png", resultados: { "c1": 4 } },
    { id: "C002", nombre: "I.E. GLORIOSA 329", cat: "A", logo: "gloriosa329.png", resultados: { "c1": 3 } }
];

// --- ENDPOINTS API ---

// Login
app.post('/api/login', (req, res) => {
    const { usuario, pass } = req.body;
    const user = usuariosRegistrados.find(u => u.usuario.toLowerCase() === usuario.toLowerCase() && u.pass === pass);
    if (user) {
        res.json({ ok: true, usuario: { nombre: user.nombre, rol: user.rol } });
    } else {
        res.status(401).json({ ok: false, message: "Credenciales inválidas" });
    }
});

// Obtener datos
app.get('/api/datos', (req, res) => {
    res.json({ concursos: concursosGlobales, colegios: colegiosGlobales });
});

// Actualizar puntajes/eventos
app.post('/api/guardar', (req, res) => {
    const { concursos, colegios } = req.body;
    if (concursos) concursosGlobales = concursos;
    if (colegios) colegiosGlobales = colegios;
    res.json({ ok: true, message: "Datos actualizados en el servidor" });
});

// Ruta principal para servir la SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
