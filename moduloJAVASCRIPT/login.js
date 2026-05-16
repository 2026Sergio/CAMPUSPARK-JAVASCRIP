const formulario = document.getElementById('formulario');
const formRegistro = document.getElementById('form-registro');
const modalRegistro = document.getElementById('modal-registro');
const btnAbrirRegistro = document.getElementById('btn-abrir-registro');
const btnCerrarRegistro = document.querySelector('#form-registro button[type="button"]');

let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];

const extraerDatos = (e) => {
    e.preventDefault();
    let user = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    const USER_CORRECTO = "admin@campusparking.com";
    const PASS_CORRECTA = "Admin123";

    const usuarioEncontrado = usuariosRegistrados.find(u => u.correo === user && u.pass === password);

    if ((user === USER_CORRECTO && password === PASS_CORRECTA) || usuarioEncontrado) {

        console.log("%c LOGIN EXITOSO ", "background: #27ae60; color: white; font-weight: bold;");
        console.log({
            evento: "Inicio de Sesión",
            usuario_actual: user,
            perfil: usuarioEncontrado ? "Usuario Externo" : "Administrador",
            fecha: new Date().toLocaleString()
        });

        alert("Acceso concedido. ¡Bienvenido!");
        window.location.href = './home.html';
    } else {
        alert("Usuario o contraseña incorrectos.");
        console.warn("Intento de acceso fallido:", { user, fecha: new Date().toLocaleString() });
    }
}

formulario.addEventListener('submit', extraerDatos);

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nuevoEmail = document.getElementById('reg-email').value;
    const nuevaPass = document.getElementById('reg-password').value;
    const nuevoNombre = document.getElementById('reg-username').value;

    if (usuariosRegistrados.some(u => u.correo === nuevoEmail)) {
        alert("Este correo ya está registrado.");
        return;
    }
    const nuevoUsuario = {
        nombre: nuevoNombre,
        correo: nuevoEmail,
        pass: nuevaPass
    };

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosRegistrados));

    console.log("NUEVO USUARIO REGISTRADO:", nuevoUsuario);

    alert("Cuenta creada con éxito. Ahora ya puedes iniciar sesión.");
    modalRegistro.classList.remove('activo');
    formRegistro.reset();
});

btnAbrirRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    modalRegistro.classList.add('activo');
});

btnCerrarRegistro.addEventListener('click', () => {
    modalRegistro.classList.remove('activo');
});

document.getElementById('visible').addEventListener('change', (e) => {
    const passInput = document.getElementById('password');
    passInput.type = e.target.checked ? 'text' : 'password';
});