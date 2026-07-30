let usuarioActual = null;
let timerInterval = null;
let concursosGlobales = [];
let colegiosGlobales = [];

function obtenerRutaLogo(nombreLogo) {
    if (!nombreLogo) return '/logos/orbegoso.png';
    if (nombreLogo.startsWith('http://') || nombreLogo.startsWith('https://')) {
        return nombreLogo;
    }
    const archivo = nombreLogo.replace('/logos/', '').replace('logos/', '');
    return `/logos/${archivo}`;
}

function generarFallbackLogo(nombreColegio) {
    const texto = (nombreColegio || 'IE').split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#1C2541" rx="50"/>
        <text x="50" y="58" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#00B4D8" text-anchor="middle">${texto}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function cargarDatosServidor() {
    try {
        const response = await fetch('/api/datos');
        const data = await response.json();
        concursosGlobales = data.concursos;
        colegiosGlobales = data.colegios;

        actualizarTripticoInicio();
        renderSeccionConcursos();
        actualizarSelectConcursos();
        renderTablaPublica(colegiosGlobales);
    } catch (error) {
        console.error("Error al obtener los datos del servidor:", error);
    }
}

async function sincronizarServidor() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;

    try {
        const response = await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                concursos: concursosGlobales,
                colegios: colegiosGlobales,
                userRole: usuarioActual.rol
            })
        });

        const data = await response.json();
        if (!data.ok) {
            alert(data.message || "Error al sincronizar datos.");
        }
    } catch (error) {
        console.error("Error guardando datos:", error);
    }
}

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
        if (indexPrincipal > 0) evAnterior = concursosGlobales[indexPrincipal - 1];
        if (indexPrincipal + 1 < concursosGlobales.length) evSiguiente = concursosGlobales[indexPrincipal + 1];
    } else if (concursosGlobales.length > 0) {
        evAnterior = concursosGlobales[concursosGlobales.length - 2] || null;
        evPrincipal = concursosGlobales[concursosGlobales.length - 1] || null;
        evSiguiente = null;
    }

    if (cardAnterior) {
        if (evAnterior) {
            const badgeClase = evAnterior.estado === 'finalizado' ? 'badge-finalizado' : (evAnterior.estado === 'cancelado' ? 'badge-cancelado' : '');
            const logoPath = obtenerRutaLogo(evAnterior.logo);
            const fallback = generarFallbackLogo(evAnterior.colegio);
            cardAnterior.innerHTML = `
                <div class="hero-badge ${badgeClase}">EVENTO ANTERIOR (${evAnterior.estado.toUpperCase()})</div>
                <h3 class="hero-main-title">${evAnterior.colegio}</h3>
                <div class="logo-3d-wrapper">
                    <img src="${logoPath}" class="logo-3d" onerror="this.onerror=null; this.src='${fallback}';">
                </div>
                <p class="hero-location">📍 ${evAnterior.lugar}, PERÚ</p>
                <p class="hero-date">📅 ${evAnterior.fechaTxt}</p>
            `;
        } else {
            cardAnterior.innerHTML = `<p style="margin:auto; color:var(--text-muted);">Sin evento previo</p>`;
        }
    }

    if (evPrincipal) {
        let badgeTexto = "PRÓXIMO EVENTO MAGNO";
        let badgeClase = "";
        if (evPrincipal.estado === 'finalizado') { badgeTexto = "EVENTO FINALIZADO"; badgeClase = "badge-finalizado"; }
        if (evPrincipal.estado === 'cancelado') { badgeTexto = "EVENTO CANCELADO"; badgeClase = "badge-cancelado"; }

        const logoPath = obtenerRutaLogo(evPrincipal.logo);
        const fallback = generarFallbackLogo(evPrincipal.colegio);

        cardPrincipal.innerHTML = `
            <div class="hero-badge ${badgeClase}">${badgeTexto}</div>
            <h2 class="hero-main-title">${evPrincipal.colegio}</h2>
            <div class="logo-3d-wrapper">
                <img src="${logoPath}" class="logo-3d" onerror="this.onerror=null; this.src='${fallback}';">
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

    if (cardSiguiente) {
        if (evSiguiente) {
            const logoPath = obtenerRutaLogo(evSiguiente.logo);
            const fallback = generarFallbackLogo(evSiguiente.colegio);
            cardSiguiente.innerHTML = `
                <div class="hero-badge">SIGUIENTE EN AGENDA</div>
                <h3 class="hero-main-title">${evSiguiente.colegio}</h3>
                <div class="logo-3d-wrapper">
                    <img src="${logoPath}" class="logo-3d" onerror="this.onerror=null; this.src='${fallback}';">
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

        const logoPath = obtenerRutaLogo(c.logo);
        const fallback = generarFallbackLogo(c.colegio);

        card.className = `match-card ${claseEstado}`;
        card.innerHTML = `
            <span class="badge">${c.lugar}</span>
            <div class="logo-3d-wrapper-sm">
                <img src="${logoPath}" alt="Logo" class="logo-3d-sm" onerror="this.onerror=null; this.src='${fallback}';">
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

async function ejecutarLogin(event) {
    if (event) event.preventDefault();
    const userInput = document.getElementById('login-username').value.trim();
    const passInput = document.getElementById('login-password').value.trim();
    const errorMsg = document.getElementById('login-error-msg');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: userInput, pass: passInput })
        });

        const data = await response.json();

        if (data.ok) {
            usuarioActual = data.usuario;
            if (errorMsg) errorMsg.classList.add('hidden');
            actualizarInterfazSegunRol();
            toggleModalLogin();
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error en login:", error);
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

async function cambiarEstadoConcursoActual(nuevoEstado) {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const select = document.getElementById('select-concurso-num');
    const idConc = select.value;

    const conc = concursosGlobales.find(c => c.id === idConc);
    if (conc) {
        conc.estado = nuevoEstado;
        renderSeccionConcursos();
        actualizarTripticoInicio();
        renderTablaPublica(colegiosGlobales);
        await sincronizarServidor();
    }
}

async function crearNuevoConcurso() {
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
        logo: "orbegoso.png",
        estado: "pendiente"
    });

    actualizarSelectConcursos();
    document.getElementById('select-concurso-num').value = idNuevo;
    renderSeccionConcursos();
    actualizarTripticoInicio();
    renderTablaPublica(colegiosGlobales);
    await sincronizarServidor();
}

async function renombrarConcursoActual() {
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
        await sincronizarServidor();
    }
}

async function eliminarConcursoActual() {
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
        await sincronizarServidor();
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

async function procesarResultadosConcurso() {
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

    renderSeccionConcursos();
    actualizarTripticoInicio();
    renderTablaPublica(colegiosGlobales);

    await sincronizarServidor();
    alert("¡Resultados y puntajes sincronizados en disco con éxito!");
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

async function cambiarCategoriaColegio(index, nuevaCat) {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    colegiosGlobales[index].cat = nuevaCat;
    renderEditorPuestos();
    renderTablaPublica(colegiosGlobales);
    await sincronizarServidor();
}

async function agregarBanda() {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    const nombre = prompt("Nombre del colegio:");
    const cat = prompt("Categoría (A, B, PRIMARIA):", "B");
    const logoRuta = prompt("Nombre del archivo de imagen (ejemplo: colegio.png):", "orbegoso.png");
    if (!nombre) return;

    const idNuevo = `C00${colegiosGlobales.length + 1}`;
    colegiosGlobales.push({ 
        id: idNuevo, 
        nombre: nombre, 
        cat: cat ? cat.toUpperCase() : "B", 
        logo: logoRuta ? logoRuta : "orbegoso.png",
        resultados: {} 
    });

    renderEditorPuestos();
    renderEditorBandas();
    renderTablaPublica(colegiosGlobales);
    await sincronizarServidor();
}

async function eliminarBanda(index) {
    if (!usuarioActual || usuarioActual.rol !== 'creador') return;
    if (confirm(`¿Eliminar ${colegiosGlobales[index].nombre}?`)) {
        colegiosGlobales.splice(index, 1);
        renderEditorPuestos();
        renderEditorBandas();
        renderTablaPublica(colegiosGlobales);
        await sincronizarServidor();
    }
}

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

        const logoPath = obtenerRutaLogo(colegio.logo);
        const fallback = generarFallbackLogo(colegio.nombre);

        let rowHTML = `
            <td>${pos}</td>
            <td style="text-align:left;">
                <div class="col-info">
                    <img src="${logoPath}" class="table-logo-img" alt="Logo" onerror="this.onerror=null; this.src='${fallback}';">
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

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosServidor();
});
