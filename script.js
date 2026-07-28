let usuarioActual = null;
let timerInterval = null;

// ==========================================
// 1. BASE DE DATOS DE USUARIOS
// ==========================================
const usuariosRegistrados = [
    { usuario: "jhon", pass: "123456", nombre: "Jhon Cristopher Alvarado Ruiz", rol: "creador" },
    { usuario: "orbegoso", pass: "docente1", nombre: "Docente: Gran Mariscal Orbegoso", rol: "docente" },
    { usuario: "quinones", pass: "docente2", nombre: "Docente: José Abelardo Quiñones", rol: "docente" }
];

// ==========================================
// 2. BASE DE DATOS DE CONCURSOS Y ESTADOS
// ==========================================
let concursosGlobales = [
    { id: "c1",  lugar: "VALLE",         colegio: "I.E. RINCONADA",                   docente: "Favio Mendez",     fechaTxt: "19 de Julio, 2026",        fechaISO: "2026-07-19T09:00:00", logo: "LOGOCOLEGIOS/rinconada.png",             estado: "finalizado" },
    { id: "c2",  lugar: "SANTA",         colegio: "I.E.P. G.M.L.J. ORBEGOSO",         docente: "Erik Obando",      fechaTxt: "23 de Agosto, 2026",       fechaISO: "2026-08-23T09:00:00", logo: "LOGOCOLEGIOS/orbegoso.png",              estado: "pendiente" },
    { id: "c3",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. ABELARDO QUIÑONES",           docente: "Ernesto Lomparte", fechaTxt: "29 de Agosto, 2026",       fechaISO: "2026-08-29T09:00:00", logo: "LOGOCOLEGIOS/quinones.png",              estado: "pendiente" },
    { id: "c4",  lugar: "NUEVO CHIMBOTE",colegio: "I.E.P. EL SEÑOR ES MI PASTOR",    docente: "Erik Obando",      fechaTxt: "20 de Septiembre, 2026",   fechaISO: "2026-09-20T09:00:00", logo: "LOGOCOLEGIOS/pastor.png",                estado: "pendiente" },
    { id: "c5",  lugar: "CASMA",         colegio: "I.E. REPÚBLICA DE CHILE",          docente: "Ernesto Lomparte", fechaTxt: "26 de Septiembre, 2026",   fechaISO: "2026-09-26T09:00:00", logo: "LOGOCOLEGIOS/chile.png",                 estado: "pendiente" },
    { id: "c6",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. REPÚBLICA ARGENTINA",        docente: "Juan Pablo",       fechaTxt: "03 de Octubre, 2026",      fechaISO: "2026-10-03T09:00:00", logo: "LOGOCOLEGIOS/republica_argentina.png",   estado: "pendiente" },
    { id: "c7",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. EXPERIMENTAL UNS",            docente: "Jose Galvez",      fechaTxt: "10 de Octubre, 2026",      fechaISO: "2026-10-10T09:00:00", logo: "LOGOCOLEGIOS/experimental_uns.png",    estado: "pendiente" },
    { id: "c8",  lugar: "CHIMBOTE",      colegio: "I.E. GLORIOSA 329",                docente: "Miguel Mondoñedo", fechaTxt: "17 de Octubre, 2026",      fechaISO: "2026-10-17T09:00:00", logo: "LOGOCOLEGIOS/gloriosa_329.png",          estado: "pendiente" },
    { id: "c9",  lugar: "NUEVO CHIMBOTE",colegio: "I.E. YUGOSLAVO",                   docente: "Esteban Salas",    fechaTxt: "24 de Octubre, 2026",      fechaISO: "2026-10-24T09:00:00", logo: "LOGOCOLEGIOS/yugoslavo.png",             estado: "pendiente" },
    { id: "c10", lugar: "CHIMBOTE",      colegio: "I.E. JOSÉ GÁLVEZ",                 docente: "Luis Monzón",      fechaTxt: "31 de Octubre, 2026",      fechaISO: "2026-10-31T09:00:00", logo: "LOGOCOLEGIOS/jose_galvez.png",           estado: "pendiente" },
    { id: "c11", lugar: "NUEVO CHIMBOTE",colegio: "I.E. PEDRO PABLO ATUSPARIA",       docente: "Juan Pablo",       fechaTxt: "07 de Noviembre, 2026",    fechaISO: "2026-11-07T09:00:00", logo: "LOGOCOLEGIOS/atusparia.png",              estado: "pendiente" },
    { id: "c12", lugar: "SAN JACINTO",   colegio: "I.E.P. SAN FELIPE",                docente: "Boris Montero",    fechaTxt: "14 de Noviembre, 2026",    fechaISO: "2026-11-14T09:00:00", logo: "LOGOCOLEGIOS/san_felipe.png",             estado: "pendiente" },
    { id: "c13", lugar: "SAN JACINTO",   colegio: "I.E. SAN JACINTO",                 docente: "Miguel Mondoñedo", fechaTxt: "22 de Noviembre, 2026",    fechaISO: "2026-11-22T09:00:00", logo: "LOGOCOLEGIOS/san_jacinto.png",            estado: "pendiente" },
    { id: "c14", lugar: "CHIMBOTE",      colegio: "I.E. EX 314",                      docente: "Erik Obando",      fechaTxt: "05 de Diciembre, 2026",    fechaISO: "2026-12-05T09:00:00", logo: "LOGOCOLEGIOS/ex_314.png",                estado: "pendiente" },
    { id: "c15", lugar: "COISHCO",       colegio: "I.E.P. JEAN PIAGET",               docente: "Victor Sanchez",   fechaTxt: "12 de Diciembre, 2026",    fechaISO: "2026-12-12T09:00:00", logo: "LOGOCOLEGIOS/jean_piaget.png",            estado: "pendiente" }
];

let colegiosGlobales = [
    // --- CATEGORÍA A ---
    { id: "C001", nombre: "I.E. EXPERIMENTAL UNS", cat: "A", logo: "LOGOCOLEGIOS/experimental_uns.png", resultados: { "c1": 4 } },
    { id: "C002", nombre: "I.E. GLORIOSA 329", cat: "A", logo: "LOGOCOLEGIOS/gloriosa_329.png", resultados: { "c1": 3 } },
    { id: "C003", nombre: "I.E. JOSÉ GÁLVEZ", cat: "A", logo: "LOGOCOLEGIOS/jose_galvez.png", resultados: { "c1": 2 } },
    { id: "C004", nombre: "I.E. REPÚBLICA ARGENTINA", cat: "A", logo: "LOGOCOLEGIOS/republica_argentina.png", resultados: { "c1": 1 } },
    { id: "C005", nombre: "I.E. PEDRO PABLO ATUSPARIA", cat: "A", logo: "LOGOCOLEGIOS/atusparia.png", resultados: {} },
    { id: "C006", nombre: "I.E. REPÚBLICA DE CHILE", cat: "A", logo: "LOGOCOLEGIOS/chile.png", resultados: {} },
    { id: "C007", nombre: "I.E. SAN JACINTO", cat: "A", logo: "LOGOCOLEGIOS/san_jacinto.png", resultados: {} },
    { id: "C008", nombre: "I.E.P. EL SEÑOR ES MI PASTOR", cat: "A", logo: "LOGOCOLEGIOS/pastor.png", resultados: {} },
    { id: "C009", nombre: "I.E.P. G.M.L.J. ORBEGOSO", cat: "A", logo: "LOGOCOLEGIOS/orbegoso.png", resultados: {} },

    // --- CATEGORÍA B ---
    { id: "C010", nombre: "I.E. ABELARDO QUIÑONES", cat: "B", logo: "LOGOCOLEGIOS/quinones.png", resultados: {} },
    { id: "C011", nombre: "I.E. CONSTRUCTORES DEL SABER", cat: "B", logo: "LOGOCOLEGIOS/constructores_saber.png", resultados: {} },
    { id: "C012", nombre: "I.E. LA HUACA", cat: "B", logo: "LOGOCOLEGIOS/la_huaca.png", resultados: {} },
    { id: "C013", nombre: "I.E. LAS BRISAS", cat: "B", logo: "LOGOCOLEGIOS/las_brisas.png", resultados: {} },
    { id: "C014", nombre: "I.E. RINCONADA", cat: "B", logo: "LOGOCOLEGIOS/rinconada.png", resultados: {} },
    { id: "C015", nombre: "I.E. YUGOSLAVO", cat: "B", logo: "LOGOCOLEGIOS/yugoslavo.png", resultados: {} },
    { id: "C016", nombre: "I.E.P. SANTA TERESITA DE JESÚS", cat: "B", logo: "LOGOCOLEGIOS/santa_teresita_jesus.png", resultados: {} },
    { id: "C017", nombre: "I.E.P. JEAN PIAGET", cat: "B", logo: "LOGOCOLEGIOS/jean_piaget.png", resultados: {} },
    { id: "C018", nombre: "I.E.P. SAN FELIPE", cat: "B", logo: "LOGOCOLEGIOS/san_felipe.png", resultados: {} },
    { id: "C019", nombre: "I.E.P. SANTA TERESITA", cat: "B", logo: "LOGOCOLEGIOS/santa_teresita.png", resultados: {} },
    { id: "C020", nombre: "I.E. ANDRÉS AVELINO CÁCERES", cat: "B", logo: "LOGOCOLEGIOS/avelino_caceres.png", resultados: {} },
    { id: "C021", nombre: "I.E.P. SCHOOL KINDER KING", cat: "B", logo: "LOGOCOLEGIOS/orbegoso.png", resultados: { "c1": 4 } },

    // --- CATEGORÍA PRIMARIA ---
    { id: "C022", nombre: "I.E. EX 314", cat: "PRIMARIA", logo: "LOGOCOLEGIOS/ex_314.png", resultados: { "c1": 4 } }
];

// ==========================================
// 3. VISTA TRÍPTICO DE INICIO
// ==========================================
function actualizarTripticoInicio() {
    const cardAnterior = document.getElementById('card-evento-anterior');
    const cardPrincipal = document.getElementById('card-evento-principal');
    const cardSiguiente = document.getElementById('card-evento-siguiente');

    if (!cardPrincipal) return;

    if (timerInterval) clearInterval(timerInterval);

    const indexPrincipal = concursosGlobales.findIndex(c => c.estado === 'pendiente');

    let evAnterior = null;
    let evPrincipal = null;
    let evSiguiente = null;

    if (indexPrincipal !== -1) {
        evPrincipal = concursosGlobales[indexPrincipal];
        if (indexPrincipal > 0) {
            evAnterior = concursosGlobales[indexPrincipal - 1];
        }
        if (indexPrincipal + 1 < concursosGlobales.length) {
            evSiguiente = concursosGlobales[indexPrincipal + 1];
        }
    } else {
        evAnterior = concursosGlobales[concursosGlobales.length - 2] || null;
        evPrincipal = concursosGlobales[concursosGlobales.length - 1] || null;
        evSiguiente = null;
    }

    // Render Tarjeta Izquierda (Anterior)
    if (cardAnterior) {
        if (evAnterior) {
            const badgeClase = evAnterior.estado === 'finalizado' ? 'badge-finalizado' : (evAnterior.estado === 'cancelado' ? 'badge-cancelado' : '');
            cardAnterior.innerHTML = `
                <div class="hero-badge ${badgeClase}">EVENTO ANTERIOR (${evAnterior.estado.toUpperCase()})</div>
                <h3 class="hero-main-title">${evAnterior.colegio}</h3>
                <div class="logo-3d-wrapper">
                    <img src="${evAnterior.logo}" class="logo-3d" onerror="this.onerror=null; this.src='LOGOCOLEGIOS/orbegoso.png';">
                </div>
                <p class="hero-location">📍 ${evAnterior.lugar}, PERÚ</p>
                <p class="hero-date">📅 ${evAnterior.fechaTxt}</p>
            `;
        } else {
            cardAnterior.innerHTML = `<p style="margin:auto; color:var(--text-muted);">Sin evento previo</p>`;
        }
    }

    // Render Tarjeta Central (Principal)
    if (evPrincipal) {
        let badgeTexto = "PRÓXIMO EVENTO MAGNO";
        let badgeClase = "";
        if (evPrincipal.estado === 'finalizado') { badgeTexto = "EVENTO FINALIZADO"; badgeClase = "badge-finalizado"; }
        if (evPrincipal.estado === 'cancelado') { badgeTexto = "EVENTO CANCELADO"; badgeClase = "badge-cancelado"; }

        cardPrincipal.innerHTML = `
            <div class="hero-badge ${badgeClase}">${badgeTexto}</div>
            <h2 class="hero-main-title">${evPrincipal.colegio}</h2>
            <div class="logo-3d-wrapper">
                <img src="${evPrincipal.logo}" class="logo-3d" onerror="this.onerror=null; this.src='LOGOCOLEGIOS/orbegoso.png';">
            </div>
            <p class="hero-location">📍 ${evPrincipal.lugar}, PERÚ</p>
            <p class="hero-date">📅 ${evPrincipal.fechaTxt} - 09:00 AM</p>
            <div id="countdown-wrapper" class="countdown-container"></div>
        `;

        if (evPrincipal.estado === 'pendiente') {
            iniciarConteoRegresivo(evPrincipal.fechaISO);
        } else if (evPrincipal.estado === 'cancelado') {
            document.getElementById('countdown-wrapper').innerHTML = `<h4 style="color:#ef4444; font-weight:bold;">❌ EVENTO CANCELADO</h4>`;
        } else {
            document.getElementById('countdown-wrapper').innerHTML = `<h4 style="color:#22c55e; font-weight:bold;">✔ EVENTO FINALIZADO</h4>`;
        }
    }

    // Render Tarjeta Derecha (Siguiente)
    if (cardSiguiente) {
        if (evSiguiente) {
            cardSiguiente.innerHTML = `
                <div class="hero-badge">SIGUIENTE EN AGENDA</div>
                <h3 class="hero-main-title">${evSiguiente.colegio}</h3>
                <div class="logo-3d-wrapper">
                    <img src="${evSiguiente.logo}" class="logo-3d" onerror="this.onerror=null; this.src='LOGOCOLEGIOS/orbegoso.png';">
                </div>
                <p class="hero-location">📍 ${evSiguiente.lugar}, PERÚ</p>
                <p class="hero-date">📅 ${evSiguiente.fechaTxt}</p>
            `;
        } else {
            cardSiguiente.innerHTML = `<p style="margin:auto; color:var(--text-muted);">Último evento de la temporada</p>`;
        }
    }
}

function iniciarConteoRegresivo(fechaIsoString) {
    const container = document.getElementById('countdown-wrapper');
    if (!container) return;

    container.innerHTML = `
        <div class="time-block"><span id="cd-days">00</span><label>Días</label></div>
        <div class="time-separator">:</div>
        <div class="time-block"><span id="cd-hours">00</span><label>Horas</label></div>
        <div class="time-separator">:</div>
        <div class="time-block"><span id="cd-minutes">00</span><label>Minutos</label></div>
        <div class="time-separator">:</div>
        <div class="time-block"><span id="cd-seconds">00</span><label>Segundos</label></div>
    `;

    const fechaObjetivo = new Date(fechaIsoString).getTime();

    timerInterval = setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = fechaObjetivo - ahora;

        if (diferencia <= 0) {
            clearInterval(timerInterval);
            container.innerHTML = `<h4 style="color:#22c55e; font-weight:bold;">✔ EVENTO FINALIZADO</h4>`;
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
// 4. RENDERIZADO Y REORDENAMIENTO DE CONCURSOS
// ==========================================
function renderSeccionConcursos() {
    const grid = document.getElementById('concursos-grid-container');
    if (!grid) return;

    grid.innerHTML = '';

    const pendientes = concursosGlobales.filter(c => c.estado === 'pendiente');
    const noPendientes = concursosGlobales.filter(c => c.estado === 'finalizado' || c.estado === 'cancelado');

    const listaOrdenada = [...pendientes, ...noPendientes];

    listaOrdenada.forEach(c => {
        const card = document.createElement('article');
        let claseEstado = '';
        let badgeEstadoHTML = '';

        if (c.estado === 'finalizado') {
            claseEstado = 'card-finalizado';
            badgeEstadoHTML = `<br><span class="badge-status-finalizado">✔ EVENTO FINALIZADO</span>`;
        } else if (c.estado === 'cancelado') {
            claseEstado = 'card-cancelado';
            badgeEstadoHTML = `<br><span class="badge-status-cancelado">✖ EVENTO CANCELADO</span>`;
        }

        card.className = `match-card ${claseEstado}`;
        card.innerHTML = `
            <span class="badge">${c.lugar}</span>
            <div class="logo-3d-wrapper-sm">
                <img src="${c.logo}" alt="Logo" class="logo-3d-sm" onerror="this.onerror=null; this.src='LOGOCOLEGIOS/orbegoso.png';">
            </div>
            <div class="vs">
                <h3>${c.colegio}</h3>
                <p class="teacher-info">👨‍🏫 <strong>Docente:</strong> ${c.docente}</p>
            </div>
            <p class="match-date">📅 ${c.fechaTxt}</p>
            ${badgeEstadoHTML}
        `;
        grid.appendChild(card);
    });
}

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
        usuarioActual = { rol: usuarioEncontrado.rol, nombre: usuarioEncontrado.nombre };
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
// 5. GESTIÓN DEL PANEL CREADOR
// ==========================================
function actualizarSelectConcursos() {
    const select = document.getElementById('select-concurso-num');
    if (!select) return;
    select.innerHTML = '';

    concursosGlobales.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.innerText = `${c.fechaTxt.split(',')[0]}: ${c.colegio}`;
        select.appendChild(opt);
    });

    alCambiarConcursoSeleccionado();
}

function alCambiarConcursoSeleccionado() {
    const select = document.getElementById('select-concurso-num');
    const selectEstado = document.getElementById('select-estado-concurso');
    if (!select || !selectEstado) return;

    const idConc = select.value;
    const conc = concursosGlobales.find(c => c.id === idConc);
    if (conc) {
        selectEstado.value = conc.estado || 'pendiente';
    }

    renderEditorPuestos();
}

function cambiarEstadoConcursoActual(nuevoEstado) {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const select = document.getElementById('select-concurso-num');
    const idConc = select.value;

    const conc = concursosGlobales.find(c => c.id === idConc);
    if (conc) {
        conc.estado = nuevoEstado;
        
        renderSeccionConcursos();
        actualizarTripticoInicio();
        renderTablaPublica(colegiosGlobales);
    }
}

function crearNuevoConcurso() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const colegio = prompt("Nombre del colegio sede:");
    if (!colegio) return;

    const idNuevo = `c${Date.now()}`;
    concursosGlobales.push({
        id: idNuevo,
        lugar: "SEDE",
        colegio: colegio,
        docente: "Por Asignar",
        fechaTxt: "Fecha Por Definir",
        fechaISO: "2026-12-31T09:00:00",
        logo: "LOGOCOLEGIOS/orbegoso.png",
        estado: "pendiente"
    });

    actualizarSelectConcursos();
    document.getElementById('select-concurso-num').value = idNuevo;
    renderSeccionConcursos();
    actualizarTripticoInicio();
    renderTablaPublica(colegiosGlobales);
}

function renombrarConcursoActual() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const select = document.getElementById('select-concurso-num');
    const idConc = select.value;

    const conc = concursosGlobales.find(c => c.id === idConc);
    if (!conc) return;

    const nuevoNombre = prompt("Nuevo nombre para la sede:", conc.colegio);
    if (nuevoNombre) {
        conc.colegio = nuevoNombre;
        actualizarSelectConcursos();
        select.value = idConc;
        renderSeccionConcursos();
        actualizarTripticoInicio();
        renderTablaPublica(colegiosGlobales);
    }
}

function eliminarConcursoActual() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const select = document.getElementById('select-concurso-num');
    const idConc = select.value;

    const concIndex = concursosGlobales.findIndex(c => c.id === idConc);
    if (concIndex === -1) return;

    const conc = concursosGlobales[concIndex];
    if (confirm(`¿Estás seguro de eliminar el concurso sede: "${conc.colegio}"?`)) {
        concursosGlobales.splice(concIndex, 1);

        colegiosGlobales.forEach(col => {
            if (col.resultados && col.resultados[idConc]) {
                delete col.resultados[idConc];
            }
        });

        actualizarSelectConcursos();
        renderSeccionConcursos();
        actualizarTripticoInicio();
        renderTablaPublica(colegiosGlobales);
        alert("El evento ha sido eliminado exitosamente.");
    }
}

function renderEditorPuestos() {
    const container = document.getElementById('editor-puestos-container');
    const select = document.getElementById('select-concurso-num');
    if (!container || !select || concursosGlobales.length === 0) return;

    const concursoId = select.value;
    let html = `<table class="standings-table"><thead><tr><th>Colegio</th><th>Categoría</th><th>Puesto / Resultado</th></tr></thead><tbody>`;

    colegiosGlobales.forEach((col, index) => {
        const ptsActuales = (col.resultados && col.resultados[concursoId] !== undefined) ? col.resultados[concursoId] : 0;
        
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
                    <select id="puesto-col-${index}" class="admin-select">
                        <option value="0" ${puestoSelected === '0' ? 'selected' : ''}>NP (No Participó - 0 pts)</option>
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
        alert("Acceso denegado. Solo el Creador puede guardar resultados.");
        return;
    }

    const concursoSeleccionado = document.getElementById('select-concurso-num').value;
    const conc = concursosGlobales.find(c => c.id === concursoSeleccionado);

    if (conc && conc.estado === 'pendiente') {
        conc.estado = 'finalizado';
        document.getElementById('select-estado-concurso').value = 'finalizado';
    }

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

    alert("¡Resultados e historia de puntos guardados con éxito!");
    
    renderSeccionConcursos();
    actualizarTripticoInicio();
    renderTablaPublica(colegiosGlobales);
}

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
    const cat = prompt("Categoría (A, B, PRIMARIA):", "B");
    const logoRuta = prompt("Nombre de la imagen en LOGOCOLEGIOS/:", "orbegoso.png");
    if (!nombre) return;

    const idNuevo = `C00${colegiosGlobales.length + 1}`;
    colegiosGlobales.push({ 
        id: idNuevo, 
        nombre: nombre, 
        cat: cat ? cat.toUpperCase() : "B", 
        logo: logoRuta ? `LOGOCOLEGIOS/${logoRuta}` : "LOGOCOLEGIOS/orbegoso.png",
        resultados: {} 
    });

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
// 6. TABLA GENERAL DE POSICIONES
// ==========================================
function renderTablaPublica(lista) {
    const tbody = document.getElementById('tabla-body');
    const headerRow = document.getElementById('tabla-header-row');
    if (!tbody || !headerRow) return;

    const concursosConPuntos = concursosGlobales.filter(c => c.estado === 'finalizado');

    let headerHTML = `<th>Pos</th><th>Colegio</th>`;
    concursosConPuntos.forEach(c => {
        const fechaCorta = c.fechaTxt.split(',')[0];
        headerHTML += `<th>${fechaCorta}<br>${c.colegio}</th>`;
    });
    headerHTML += `<th>PTS TOTAL</th>`;
    headerRow.innerHTML = headerHTML;

    const listaConPuntos = lista.map(col => {
        let total = 0;
        concursosConPuntos.forEach(c => {
            const pts = (col.resultados && col.resultados[c.id] !== undefined) ? col.resultados[c.id] : 0;
            total += pts;
        });
        return { ...col, totalPts: total };
    });

    listaConPuntos.sort((a, b) => b.totalPts - a.totalPts);

    tbody.innerHTML = '';

    if (concursosConPuntos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="padding:20px; text-align:center; color:#94a3b8;">Aún no hay concursos finalizados con puntajes cargados.</td></tr>`;
        return;
    }

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

        concursosConPuntos.forEach(c => {
            const pts = (colegio.resultados && colegio.resultados[c.id] !== undefined) ? colegio.resultados[c.id] : 0;
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

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    actualizarTripticoInicio();
    renderSeccionConcursos();
    actualizarSelectConcursos();
    renderTablaPublica(colegiosGlobales);
});
