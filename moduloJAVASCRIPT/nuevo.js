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

formulario.addEventListener("submit", function(e){
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("vehiculo1").value;
    const placa = document.getElementById("placa1").value;
    const fecha = document.getElementById("fecha1").value;
    const hora = document.getElementById("hora1").value;
    const espacio = document.getElementById("espacio1").value;
    const vehiculo = {
        nombre,
        tipo,
        placa,
        fecha,
        hora,
        espacio
    };
    console.log(vehiculo);
    vehiculos.push(vehiculo);
    console.log(vehiculos);
    localStorage.setItem(
        "vehiculos",
        JSON.stringify(vehiculos)
    );
    mostrarVehiculos();
    formulario.reset();
});
function mostrarVehiculos(){
    tablaBody.innerHTML = "";
    const espacios =
    document.querySelectorAll(".espacio");
    espacios.forEach(espacio => {
        espacio.classList.remove("ocupado");
        espacio.classList.add("libre");
        espacio.innerHTML = `
            <p>${espacio.id.replace("-", " ")}</p>
            <p>Disponible</p>
        `;
    });
    vehiculos.forEach((v, index) => {
        tablaBody.innerHTML += `
           <tr>
                <td>${v.nombre}</td>
                <td>${v.tipo}</td>
                <td>${v.placa}</td>
                <td>${v.espacio}</td>
                <td>
                    <button onclick="eliminarVehiculo(${index})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
        const espacioDiv =
        document.getElementById(
            `espacio-${v.espacio}`
        );
        if(espacioDiv){
            espacioDiv.classList.remove("libre");
            espacioDiv.classList.add("ocupado");
            espacioDiv.innerHTML = `
                <p>Espacio ${v.espacio}</p>
                <p>${v.nombre}</p>
                <p>${v.placa}</p>
            `;
        }

    });

}


