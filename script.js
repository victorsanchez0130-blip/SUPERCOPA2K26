// Obtener datos iniciales al cargar la página
async function cargarDatosDelServidor() {
    try {
        const res = await fetch('/api/datos');
        const data = await res.json();
        concursosGlobales = data.concursos;
        colegiosGlobales = data.colegios;

        actualizarTripticoInicio();
        renderSeccionConcursos();
        actualizarSelectConcursos();
        renderTablaPublica(colegiosGlobales);
    } catch (err) {
        console.error("Error al obtener datos del servidor:", err);
    }
}

// Reemplazar la función ejecutarLogin existente por esta versión con fetch:
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
        console.error("Error al autenticar:", error);
    }
}

// Cambiar la llamada DOMContentLoaded al final del script:
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosDelServidor();
});
