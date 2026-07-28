let usuarioActual = null;

// ==========================================
// 1. BASE DE DATOS DE USUARIOS
// ==========================================
const usuariosRegistrados = [
    {
        usuario: "jhon",
        pass: "123456",
        nombre: "Jhon Cristopher Alvarado Ruiz",
        rol: "creador"
    },
    {
        usuario: "orbegoso",
        pass: "docente1",
        nombre: "Docente: Gran Mariscal Orbegoso",
        rol: "docente"
    },
    {
        usuario: "quinones",
        pass: "docente2",
        nombre: "Docente: José Abelardo Quiñones",
        rol: "docente"
    }
];

// ==========================================
// 2. CONCURSOS Y LISTA COMPLETA DE COLEGIOS
// ==========================================
let concursosGlobales = [
    { id: "c1", nombre: "1er Concurso - Orbegoso" }
];

let colegiosGlobales = [
    // --- CATEGORÍA A ---
    { id: "C001", nombre: "I.E. EXPERIMENTAL UNS", cat: "A", logo: "LOGOCOLEGIOS/experimental_uns.png", resultados: { c1: 0 } },
    { id: "C002", nombre: "I.E. GLORIOSA 329", cat: "A", logo: "LOGOCOLEGIOS/gloriosa_329.png", resultados: { c1: 0 } },
    { id: "C003", nombre: "I.E. JOSÉ GÁLVEZ", cat: "A", logo: "LOGOCOLEGIOS/jose_galvez.png", resultados: { c1: 0 } },
    { id: "C004", nombre: "I.E. REPÚBLICA ARGENTINA", cat: "A", logo: "LOGOCOLEGIOS/republica_argentina.png", resultados: { c1: 0 } },
    { id: "C005", nombre: "I.E. PEDRO PABLO ATUSPARIA", cat: "A", logo: "LOGOCOLEGIOS/atusparia.png", resultados: { c1: 0 } },
    { id: "C006", nombre: "I.E. REPÚBLICA DE CHILE", cat: "A", logo: "LOGOCOLEGIOS/chile.png", resultados: { c1: 1 } },
    { id: "C007", nombre: "I.E. SAN JACINTO", cat: "A", logo: "LOGOCOLEGIOS/san_jacinto.png", resultados: { c1: 0 } },
    { id: "C008", nombre: "I.E.P. EL SEÑOR ES MI PASTOR", cat: "A", logo: "LOGOCOLEGIOS/pastor.png", resultados: { c1: 2 } },
    { id: "C009", nombre: "I.E.P. G.M.L.J. ORBEGOSO", cat: "A", logo: "LOGOCOLEGIOS/orbegoso.png", resultados: { c1: 4 } },

    // --- CATEGORÍA B ---
    { id: "C010", nombre: "I.E. ABELARDO QUIÑONES", cat: "B", logo: "LOGOCOLEGIOS/quinones.png", resultados: { c1: 3 } },
    { id: "C011", nombre: "I.E. CONSTRUCTORES DEL SABER", cat: "B", logo: "LOGOCOLEGIOS/constructores_saber.png", resultados: { c1: 0 } },
    { id: "C012", nombre: "I.E. LA HUACA", cat: "B", logo: "LOGOCOLEGIOS/la_huaca.png", resultados: { c1: 0 } },
    { id: "C013", nombre: "I.E. LAS BRISAS", cat: "B", logo: "LOGOCOLEGIOS/las_brisas.png", resultados: { c1: 0 } },
    { id: "C014", nombre: "I.E. RINCONADA", cat: "B", logo: "LOGOCOLEGIOS/rinconada.png", resultados: { c1: 0 } },
    { id: "C015", nombre: "I.E. YUGOSLAVO", cat: "B", logo: "LOGOCOLEGIOS/yugoslavo.png", resultados: { c1: 0 } },
    { id: "C016", nombre: "I.E.P. SANTA TERESITA DE JESÚS", cat: "B", logo: "LOGOCOLEGIOS/santa_teresita_jesus.png", resultados: { c1: 0 } },
    { id: "C017", nombre: "I.E.P. JEAN PIAGET", cat: "B", logo: "LOGOCOLEGIOS/jean_piaget.png", resultados: { c1: 0 } },
    { id: "C018", nombre: "I.E.P. SAN FELIPE", cat: "B", logo: "LOGOCOLEGIOS/san_felipe.png", resultados: { c1: 0 } },
    { id: "C019", nombre: "I.E.P. SANTA TERESITA", cat: "B", logo: "LOGOCOLEGIOS/santa_teresita.png", resultados: { c1: 0 } },
    { id: "C020", nombre: "I.E. ANDRÉS AVELINO CÁCERES", cat: "B", logo: "LOGOCOLEGIOS/avelino_caceres.png", resultados: { c1: 0 } },

    // --- CATEGORÍA PRIMARIA ---
    { id: "C021", nombre: "I.E. EX 314", cat: "PRIMARIA", logo: "LOGOCOLEGIOS/ex_314.png", resultados: { c1: 0 } }
];

// ==========================================
// 3. CONTEO REGRESIVO EN VIVO
// ==========================================
function iniciarConteoRegresivo() {
    const fechaObjetivo = new Date("August 23, 2026 09:00:00").getTime();

    const timer = setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = fechaObjetivo - ahora;

        if (diferencia <= 0) {
            clearInterval(timer);
            const container = document.querySelector('.countdown-container');
            if (container) container.innerHTML = "<h3>¡EL EVENTO HA COMENZADO!</h3>";
            return;
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        const elDays = document.getElementById('cd-days');
        const elHours = document.getElementById('cd-hours');
        const elMinutes = document.getElementById('cd-minutes');
        const elSeconds = document.getElementById('cd-seconds');

        if (elDays) elDays.innerText = dias < 10 ? `0${dias}` : dias;
        if (elHours) elHours.innerText = horas < 10 ? `0${horas}` : horas;
        if (elMinutes) elMinutes.innerText = minutos < 10 ? `0${minutos}` : minutos;
        if (elSeconds) elSeconds.innerText = segundos < 10 ? `0${segundos}` : segundos;
    }, 1000);
}

// ==========================================
// 4. NAVEGACIÓN Y SESIÓN
// ==========================================
function mostrarSeccion(idSeccion, btn) {
    document.querySelectorAll('.seccion-pagina').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const seccionObjetivo = document.getElementById(`sec-${idSeccion}`);
    if (seccionObjetivo) seccionObjetivo.classList.add('active');
    if (btn) btn.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleModalLogin() {
    const modal = document.getElementById('modal-login');
    const errorMsg = document.getElementById('login-error-msg');
    
    if (!modal) return;
    modal.classList.toggle('hidden');
    
    if (!modal.classList.contains('hidden')) {
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        if (errorMsg) errorMsg.classList.add('hidden');
    }
}

function ejecutarLogin(event) {
    if (event) event.preventDefault();

    const userInput = document.getElementById('login-username').value.trim();
    const passInput = document.getElementById('login-password').value.trim();
    const errorMsg = document.getElementById('login-error-msg');

    const usuarioEncontrado = usuariosRegistrados.find(
        u => u.usuario.toLowerCase() === userInput.toLowerCase() && u.pass === passInput
    );

    if (usuarioEncontrado) {
        usuarioActual = {
            rol: usuarioEncontrado.rol,
            nombre: usuarioEncontrado.nombre
        };

        if (errorMsg) errorMsg.classList.add('hidden');
        actualizarInterfazSegunRol();
        toggleModalLogin();
    } else {
        if (errorMsg) errorMsg.classList.remove('hidden');
    }
}

function cerrarSesion() {
    usuarioActual = null;
    actualizarInterfazSegunRol();
    const panelEdicion = document.getElementById('panel-edicion');
    if (panelEdicion) panelEdicion.classList.add('hidden');
}

function actualizarInterfazSegunRol() {
    const btnLoginModal = document.getElementById('btn-login-modal');
    const btnLogout = document.getElementById('btn-logout');
    const adminBar = document.getElementById('admin-bar');
    const roleBadge = document.getElementById('role-badge');
    const userDisplayName = document.getElementById('user-display-name');
    const btnAbrirPanel = document.getElementById('btn-abrir-panel');
    const panelEdicion = document.getElementById('panel-edicion');

    if (usuarioActual) {
        if (btnLoginModal) btnLoginModal.classList.add('hidden');
        if (btnLogout) btnLogout.classList.remove('hidden');
        if (adminBar) adminBar.classList.remove('hidden');
        if (userDisplayName) userDisplayName.innerText = `Usuario: ${usuarioActual.nombre}`;

        if (usuarioActual.rol === 'creador') {
            if (roleBadge) roleBadge.innerText = 'ROL: CREADOR';
            if (btnAbrirPanel) btnAbrirPanel.classList.remove('hidden');
        } else {
            if (roleBadge) roleBadge.innerText = 'ROL: DOCENTE';
            if (btnAbrirPanel) btnAbrirPanel.classList.add('hidden');
            if (panelEdicion) panelEdicion.classList.add('hidden');
        }
    } else {
        if (btnLoginModal) btnLoginModal.classList.remove('hidden');
        if (btnLogout) btnLogout.classList.add('hidden');
        if (adminBar) adminBar.classList.add('hidden');
        if (panelEdicion) panelEdicion.classList.add('hidden');
    }

    actualizarSelectConcursos();
    renderEditorPuestos();
    renderEditorBandas();
}

function togglePanelGestion() {
    if (usuarioActual && usuarioActual.rol === 'creador') {
        const panelEdicion = document.getElementById('panel-edicion');
        if (panelEdicion) panelEdicion.classList.toggle('hidden');
    }
}

function cambiarTab(tabId, btn) {
    document.querySelectorAll('.tab-content-panel').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-tabs-custom .tab-btn').forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    if (btn) btn.classList.add('active');
}

// ==========================================
// 5. GESTIÓN DE CONCURSOS Y PUNTUACIÓN
// ==========================================
function actualizarSelectConcursos() {
    const select = document.getElementById('select-concurso-num');
    if (!select) return;
    select.innerHTML = '';

    concursosGlobales.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.innerText = c.nombre;
        select.appendChild(opt);
    });
}

function crearNuevoConcurso() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const nombre = prompt("Nombre del nuevo concurso:");
    if (!nombre) return;

    const idNuevo = `c${concursosGlobales.length + 1}`;
    concursosGlobales.push({ id: idNuevo, nombre: nombre });

    colegiosGlobales.forEach(col => {
        if (!col.resultados) col.resultados = {};
        col.resultados[idNuevo] = 0;
    });

    actualizarSelectConcursos();
    document.getElementById('select-concurso-num').value = idNuevo;
    renderEditorPuestos();
    renderTablaPublica(colegiosGlobales);
}

function renombrarConcursoActual() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const select = document.getElementById('select-concurso-num');
    const idConc = select.value;

    const concursoObj = concursosGlobales.find(c => c.id === idConc);
    if (!concursoObj) return;

    const nuevoNombre = prompt("Nuevo nombre:", concursoObj.nombre);
    if (nuevoNombre) {
        concursoObj.nombre = nuevoNombre;
        actualizarSelectConcursos();
        select.value = idConc;
        renderTablaPublica(colegiosGlobales);
    }
}

function alCambiarConcursoSeleccionado() {
    renderEditorPuestos();
}

function renderEditorPuestos() {
    const container = document.getElementById('editor-puestos-container');
    const select = document.getElementById('select-concurso-num');
    if (!container || !select || concursosGlobales.length === 0) {
        if(container) container.innerHTML = '<p style="padding:15px; text-align:center;">No hay concursos creados aún.</p>';
        return;
    }

    const concursoId = select.value;
    let html = `<table class="standings-table"><thead><tr><th>Colegio</th><th>Categoría</th><th>Puesto / Resultado</th></tr></thead><tbody>`;

    colegiosGlobales.forEach((col, index) => {
        const ptsActuales = (col.resultados && col.resultados[concursoId]) ? col.resultados[concursoId] : 0;
        let puestoSelected = "0";
        if (ptsActuales === 4) puestoSelected = "1";
        else if (ptsActuales === 3) puestoSelected = "2";
        else if (ptsActuales === 2) puestoSelected = "3";
        else if (ptsActuales === 1) puestoSelected = "4";

        html += `
            <tr>
                <td style="text-align:left;"><strong>${col.nombre}</strong></td>
                <td>${col.cat}</td>
                <td>
                    <select id="puesto-col-${index}" class="input-score">
                        <option value="0" ${puestoSelected === '0' ? 'selected' : ''}>NP (No Participó)</option>
                        <option value="1" ${puestoSelected === '1' ? 'selected' : ''}>1° Puesto (4 pts)</option>
                        <option value="2" ${puestoSelected === '2' ? 'selected' : ''}>2° Puesto (3 pts)</option>
                        <option value="3" ${puestoSelected === '3' ? 'selected' : ''}>3° Puesto (2 pts)</option>
                        <option value="4" ${puestoSelected === '4' ? 'selected' : ''}>4° Puesto o más (1 pt)</option>
                    </select>
                </td>
            </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function procesarResultadosConcurso() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') {
        alert("Acceso denegado. Solo el Creador puede registrar resultados.");
        return;
    }

    const concursoSeleccionado = document.getElementById('select-concurso-num').value;

    colegiosGlobales.forEach((col, index) => {
        const puestoInput = document.getElementById(`puesto-col-${index}`);
        if (!puestoInput) return;

        const puesto = parseInt(puestoInput.value);
        let puntosObtenidos = 0;

        if (puesto === 1) puntosObtenidos = 4;
        else if (puesto === 2) puntosObtenidos = 3;
        else if (puesto === 3) puntosObtenidos = 2;
        else if (puesto >= 4) puntosObtenidos = 1;

        if (!col.resultados) col.resultados = {};
        col.resultados[concursoSeleccionado] = puntosObtenidos;
    });

    alert("¡Resultados del concurso guardados correctamente!");
    renderTablaPublica(colegiosGlobales);
}

// ==========================================
// 6. GESTIÓN DE COLEGIOS Y CATEGORÍAS
// ==========================================
function renderEditorBandas() {
    const container = document.getElementById('editor-bandas-container');
    if (!container) return;

    let html = `<table class="standings-table"><thead><tr><th>Código</th><th>Institución</th><th>Categoría</th><th>Acciones</th></tr></thead><tbody>`;

    colegiosGlobales.forEach((col, index) => {
        html += `
            <tr>
                <td>${col.id}</td>
                <td style="text-align:left;">${col.nombre}</td>
                <td>
                    <select class="admin-select" onchange="cambiarCategoriaColegio(${index}, this.value)">
                        <option value="A" ${col.cat === 'A' ? 'selected' : ''}>Categoría A</option>
                        <option value="B" ${col.cat === 'B' ? 'selected' : ''}>Categoría B</option>
                        <option value="PRIMARIA" ${col.cat === 'PRIMARIA' ? 'selected' : ''}>Categoría Primaria</option>
                    </select>
                </td>
                <td>
                    <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="eliminarBanda(${index})">Eliminar</button>
                </td>
            </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function cambiarCategoriaColegio(index, nuevaCat) {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    colegiosGlobales[index].cat = nuevaCat;
    renderEditorPuestos();
    renderTablaPublica(colegiosGlobales);
}

function agregarBanda() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const nombre = prompt("Nombre del colegio:");
    const cat = prompt("Categoría (A, B, PRIMARIA):", "A");
    const logoRuta = prompt("Nombre del archivo de imagen en LOGOCOLEGIOS/ (ej: colegio.png):", "orbegoso.png");
    if (!nombre) return;

    const idNuevo = `C00${colegiosGlobales.length + 1}`;
    const nuevoColegio = { 
        id: idNuevo, 
        nombre: nombre, 
        cat: cat ? cat.toUpperCase() : "A", 
        logo: logoRuta ? `LOGOCOLEGIOS/${logoRuta}` : "LOGOCOLEGIOS/orbegoso.png",
        resultados: {} 
    };

    concursosGlobales.forEach(c => {
        nuevoColegio.resultados[c.id] = 0;
    });

    colegiosGlobales.push(nuevoColegio);

    renderEditorPuestos();
    renderEditorBandas();
    renderTablaPublica(colegiosGlobales);
}

function eliminarBanda(index) {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    if (confirm(`¿Eliminar ${colegiosGlobales[index].nombre}?`)) {
        colegiosGlobales.splice(index, 1);
        renderEditorPuestos();
        renderEditorBandas();
        renderTablaPublica(colegiosGlobales);
    }
}

// ==========================================
// 7. RENDERIZADO TABLA PÚBLICA CON LOGOS
// ==========================================
function renderTablaPublica(lista) {
    const tbody = document.getElementById('tabla-body');
    const headerRow = document.getElementById('tabla-header-row');
    if (!tbody || !headerRow) return;

    let headerHTML = `<th>Pos</th><th>Colegio</th>`;
    concursosGlobales.forEach(c => {
        headerHTML += `<th>${c.nombre}</th>`;
    });
    headerHTML += `<th>PTS TOTAL</th>`;
    headerRow.innerHTML = headerHTML;

    const listaConPuntos = lista.map(col => {
        let total = 0;
        concursosGlobales.forEach(c => {
            total += (col.resultados && col.resultados[c.id]) ? col.resultados[c.id] : 0;
        });
        return { ...col, totalPts: total };
    });

    listaConPuntos.sort((a, b) => b.totalPts - a.totalPts);

    tbody.innerHTML = '';
    listaConPuntos.forEach((colegio, index) => {
        const row = document.createElement('tr');
        let pos = `${index + 1}`;
        if (index === 0) pos = "🥇 1";
        else if (index === 1) pos = "🥈 2";
        else if (index === 2) pos = "🥉 3";

        const logoRuta = colegio.logo ? colegio.logo : 'LOGOCOLEGIOS/orbegoso.png';

        let rowHTML = `
            <td>${pos}</td>
            <td style="text-align:left;">
                <div class="col-info">
                    <img src="${logoRuta}" class="table-logo-img" alt="Logo" onerror="this.onerror=null; this.src='LOGOCOLEGIOS/orbegoso.png';">
                    <strong>${colegio.nombre}</strong>
                </div>
            </td>`;

        concursosGlobales.forEach(c => {
            const pts = (colegio.resultados && colegio.resultados[c.id]) ? colegio.resultados[c.id] : 0;
            rowHTML += `<td>${pts} pts</td>`;
        });

        rowHTML += `<td><strong>${colegio.totalPts} pts</strong></td>`;
        row.innerHTML = rowHTML;
        tbody.appendChild(row);
    });
}

function filtrar(categoria, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (categoria === 'general') renderTablaPublica(colegiosGlobales);
    else renderTablaPublica(colegiosGlobales.filter(c => c.cat === categoria));
}

// ==========================================
// 8. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    iniciarConteoRegresivo();
    actualizarSelectConcursos();
    renderTablaPublica(colegiosGlobales);
});