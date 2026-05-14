const formulario = document.getElementById('formulario');

const extraerDatos = (e) => {
    e.preventDefault();
    let user = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const USER_CORRECTO = "admin@campusparking.com";
    const PASS_CORRECTA = "Admin123";
    if (user === USER_CORRECTO && password === PASS_CORRECTA) {
        console.log("Acceso concedido");
        window.location.href = './home.html';
    } else {
        alert("Usuario o contraseña incorrectos. Intenta de nuevo.");
        console.log("Acceso denegado");
    }
}
formulario.addEventListener('submit', extraerDatos);
document.getElementById('visible').addEventListener('change', (e) => {
    const passInput = document.getElementById('password');
    passInput.type = e.target.checked ? 'text' : 'password';
});
const btnAbrirRegistro = document.getElementById('btn-abrir-registro');
const btnCerrarRegistro = document.getElementById('btn-cerrar-registro');
const modalRegistro = document.getElementById('modal-registro');

btnAbrirRegistro.addEventListener('click', (e) => {
    e.preventDefault(); 
    modalRegistro.classList.add('activo');
});
btnCerrarRegistro.addEventListener('click', () => {
    modalRegistro.classList.remove('activo');
});
document.getElementById('form-registro').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Usuario registrado con éxito");
    modalRegistro.classList.remove('activo');
});
