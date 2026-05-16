const formulario = document.getElementById('formulario');
const formRegistro = document.getElementById('form-registro'); 
const modalRegistro = document.getElementById('modal-registro');
const btnAbrirRegistro = document.getElementById('btn-abrir-registro');
const btnCerrarRegistro = document.querySelector('#form-registro button[type="button"]');

let datosAdmin = JSON.parse(localStorage.getItem('datos_admin')) || {
    nombre: "admin",
    correo: "admin@campusparking.com",
    pass: "Admin123"
};

const extraerDatos = (e) => {
    e.preventDefault();
    let user = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    if (user === datosAdmin.correo && password === datosAdmin.pass) {
        console.log("%c LOGIN EXITOSO ", "background: #27ae60; color: white; font-weight: bold;");
        alert("Acceso concedido. ¡Bienvenido!");
        window.location.href = './home.html';
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

formulario.addEventListener('submit', extraerDatos);

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    datosAdmin.nombre = document.getElementById('reg-username').value;
    datosAdmin.correo = document.getElementById('reg-email').value;
    datosAdmin.pass = document.getElementById('reg-password').value;

    localStorage.setItem('datos_admin', JSON.stringify(datosAdmin));

    console.log("DATOS DE PERFIL ACTUALIZADOS:", datosAdmin);

    alert("Datos actualizados con éxito. Ya puedes iniciar sesión con las nuevas credenciales.");
    modalRegistro.classList.remove('activo');
});

btnAbrirRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('reg-username').value = datosAdmin.nombre;
    document.getElementById('reg-email').value = datosAdmin.correo;
    document.getElementById('reg-password').value = datosAdmin.pass;
    modalRegistro.classList.add('activo');
});

btnCerrarRegistro.addEventListener('click', () => {
    modalRegistro.classList.remove('activo');
});

document.getElementById('visible').addEventListener('change', (e) => {
    const passInput = document.getElementById('password');
    passInput.type = e.target.checked ? 'text' : 'password';
});