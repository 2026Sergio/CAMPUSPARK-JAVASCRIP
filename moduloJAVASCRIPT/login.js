const formulario = document.getElementById('formulario');

let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [
    {
        nombre: "admin",
        correo: "admin@campusparking.com",
        pass: "Admin123"
    }
];

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    const encontrado = usuarios.find(u => u.correo === user && u.pass === pass);

    if (encontrado) {
        alert(`¡Bienvenido ${encontrado.nombre}!`);
        localStorage.setItem('usuario_actual', JSON.stringify(encontrado));
        window.location.href = './home.html';
    } else {
        alert("Credenciales incorrectas.");
    }
});

document.getElementById('visible').addEventListener('change', (e) => {
    const passInput = document.getElementById('password');
    passInput.type = e.target.checked ? 'text' : 'password';
});