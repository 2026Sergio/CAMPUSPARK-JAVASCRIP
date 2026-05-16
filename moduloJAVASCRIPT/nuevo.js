const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu-lateral');
const overlay = document.getElementById('overlay');
const formulario = document.getElementById("formulario1");
const tablaBody = document.getElementById("tabla-body");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelar = document.getElementById("btn-cancelar");

const tablaSalidaBody = document.getElementById("tabla-salida-body");
const tablaHistorialBody = document.getElementById("tabla-historial-body");

function toggleMenu(){
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}
btnMenu.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

mostrarVehiculos();
mostrarHistorial();

formulario.addEventListener("submit", function(e){
    e.preventDefault();
    
    let placaValor = document.getElementById("placa1").value.toUpperCase();
    let espacioValor = document.getElementById("espacio1").value;
    let esEdicion = document.getElementById("placa1").readOnly;

    if (!esEdicion) {

        const placaRepetida = vehiculos.some(v => v.placa === placaValor);
        if (placaRepetida) {
            alert("Error: El vehículo con placa " + placaValor + " ya se encuentra en el parqueo.");
            return;
        }

        const espacioOcupado = vehiculos.some(v => v.espacio === espacioValor);
        if (espacioOcupado) {
            alert("Error: El espacio " + espacioValor + " ya está ocupado. Elige otro.");
            return;
        }
    }

    if (placaValor.length !== 6) {
        alert("La placa debe tener exactamente 6 caracteres (3 letras y 3 números)");
        return;
    }
    for (let i = 0; i < 3; i++) {
        let letra = placaValor[i];
        if (!(letra >= 'A' && letra <= 'Z')) {
            alert("Los primeros 3 caracteres deben ser letras de la A a la Z");
            return;
        }
    }
    for (let i = 3; i < 6; i++) {
        let numero = placaValor[i];
        if (!(numero >= '0' && numero <= '9')) {
            alert("Los últimos 3 caracteres deben ser números del 0 al 9");
            return;
        }
    }

    const tipo = document.getElementById("vehiculo1").value;
    let precio = 0;
    if (tipo === "Moto") {
        precio = 5;
    } else if (tipo === "Carro") {
        precio = 10;
    } else {
        precio = 15; 
    }

    const datosVehiculo = {
        nombre: document.getElementById("nombre").value,
        tipo: tipo,
        placa: placaValor,
        precio: precio,
        fecha: document.getElementById("fecha1").value,
        hora: document.getElementById("hora1").value,
        espacio: espacioValor
    };
    console.log("Datos del vehículo a procesar:", datosVehiculo);

    let indiceExistente = -1;
    for (let i = 0; i < vehiculos.length; i++) {
        if (vehiculos[i].placa === placaValor) {
            indiceExistente = i;
            break;
        }
    }

    if (indiceExistente !== -1) {
        vehiculos[indiceExistente] = datosVehiculo;
        alert("Datos del vehículo con placa " + placaValor + " actualizados.");
    } else {
        vehiculos.push(datosVehiculo);
    }

    localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
    
    console.log("Inventario actualizado:");
    console.table(vehiculos);

    resetearFormulario();
    mostrarVehiculos();
});

function mostrarVehiculos(){
    if(!tablaBody) return;
    tablaBody.innerHTML = "";

    let todosLosEspacios = document.querySelectorAll(".espacio");
    for (let i = 0; i < todosLosEspacios.length; i++) {
        let div = todosLosEspacios[i];
        div.className = "espacio libre";
        let n = div.id.split("-")[1];
        div.innerHTML = "<p>Espacio " + n + "</p><p>Libre</p>";
    }

    for (let i = 0; i < vehiculos.length; i++) {
        let v = vehiculos[i];
        
        tablaBody.innerHTML += "<tr>" +
            "<td>" + v.nombre + "</td>" +
            "<td>" + v.tipo + " (Q" + v.precio + ")</td>" +
            "<td>" + v.placa + "</td>" +
            "<td>" + v.espacio + "</td>" +
            "<td>" +
                "<button type='button' onclick=\"subirParaEditar('" + v.placa + "')\" style='background:#3498db; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;'>Editar</button> " +
                "<button type='button' onclick='eliminar(" + i + ")' style='background:#e74c3c; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;'>Salida</button>" +
            "</td>" +
        "</tr>";
        
        let divEspacio = document.getElementById("espacio-" + v.espacio);
        if(divEspacio){
            divEspacio.className = "espacio ocupado";
            divEspacio.innerHTML = "<p>Espacio " + v.espacio + "</p><p>" + v.nombre + "</p><p><strong>" + v.placa + "</strong></p><p>Q" + v.precio + "</p>";
        }
    }
}

window.eliminar = function(index) {
    let v = vehiculos[index];
    let ahora = new Date();
    let horaSalida = ahora.getHours() + ":" + (ahora.getMinutes() < 10 ? '0' : '') + ahora.getMinutes();
    
    let partesEntrada = v.hora.split(":");
    let minEntrada = (parseInt(partesEntrada[0]) * 60) + parseInt(partesEntrada[1]);
    let minSalida = (ahora.getHours() * 60) + ahora.getMinutes();
    
    let diferencia = minSalida - minEntrada;
    if (diferencia <= 0) { diferencia = 60; }
    
    let totalHoras = Math.ceil(diferencia / 60);
    let cobroTotal = totalHoras * v.precio;

    let datosSalida = {
        placa: v.placa,
        tipo: v.tipo,
        hEntrada: v.hora,
        espacio: v.espacio,
        hSalida: horaSalida,
        tiempo: totalHoras + " hora(s)",
        pago: "Q" + cobroTotal
    };

    historial.push(datosSalida);
    vehiculos.splice(index, 1);

    localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
    localStorage.setItem("historial", JSON.stringify(historial));
    
    mostrarVehiculos();
    mostrarHistorial();
};

function mostrarHistorial() {
    if (tablaSalidaBody) tablaSalidaBody.innerHTML = "";
    if (tablaHistorialBody) tablaHistorialBody.innerHTML = "";

    for (let i = 0; i < historial.length; i++) {
        let h = historial[i];
        if (tablaSalidaBody) {
            tablaSalidaBody.innerHTML += "<tr>" +
                "<td>" + h.placa + "</td>" +
                "<td>" + h.tipo + "</td>" +
                "<td>" + h.hEntrada + "</td>" +
                "<td>" + h.espacio + "</td>" +
                "<td>" + h.hSalida + "</td>" +
            "</tr>";
        }
        if (tablaHistorialBody) {
            tablaHistorialBody.innerHTML += "<tr>" +
                "<td>" + h.hEntrada + "</td>" +
                "<td>" + h.hSalida + "</td>" +
                "<td>" + h.tiempo + "</td>" +
                "<td>" + h.pago + "</td>" +
            "</tr>";
        }
    }
}

window.subirParaEditar = function(placaBusqueda) {
    let v = vehiculos.find(veh => veh.placa === placaBusqueda);

    if(v) {
        document.getElementById("nombre").value = v.nombre;
        document.getElementById("vehiculo1").value = v.tipo;
        document.getElementById("placa1").value = v.placa;
        document.getElementById("placa1").readOnly = true;
        document.getElementById("fecha1").value = v.fecha;
        document.getElementById("hora1").value = v.hora;
        document.getElementById("espacio1").value = v.espacio;
        
        btnSubmit.textContent = "Actualizar Registro";
        btnSubmit.style.background = "#27ae60";
        btnCancelar.style.display = "block";
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
};

btnCancelar.onclick = resetearFormulario;

function resetearFormulario() {
    formulario.reset();
    document.getElementById("placa1").readOnly = false;
    btnSubmit.textContent = "Guardar o Actualizar";
    btnSubmit.style.background = "";
    btnCancelar.style.display = "none";
}