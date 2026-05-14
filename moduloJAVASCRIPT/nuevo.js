const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu-lateral');
const overlay = document.getElementById('overlay');
function toggleMenu(){
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}
btnMenu.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);


const formulario = document.getElementById("formulario1");

const tablaBody = document.getElementById("tabla-body");

let vehiculos =
JSON.parse(localStorage.getItem("vehiculos"))
|| [];

mostrarVehiculos();


