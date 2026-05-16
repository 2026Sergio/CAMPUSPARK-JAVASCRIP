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

actualizarSelectDinamico();
mostrarVehiculos();
mostrarHistorial();

formulario.addEventListener("submit", function(e){
    e.preventDefault();
    
    let placaInput = document.getElementById("placa1");
    let placaValor = placaInput.value.trim().toUpperCase(); 
    let horaValor = document.getElementById("hora1").value;
    let espacioValor = document.getElementById("espacio1").value;
    let esEdicion = placaInput.readOnly;

    if (!horaValor) {
        alert("Por favor, ingresa una hora de entrada.");
        return;
    }

    const regexPlaca = /^[A-Z]{3}[0-9]{3}$/;
    if (!regexPlaca.test(placaValor)) {
        alert("La placa debe tener formato ABC123");
        return;
    }

    if (!esEdicion) {
        const placaRepetida = vehiculos.some(v => v.placa === placaValor);
        if (placaRepetida) {
            alert("Error: La placa " + placaValor + " ya está en el parqueo.");
            return;
        }
        const espacioOcupado = vehiculos.some(v => v.espacio === espacioValor);
        if (espacioOcupado) {
            alert("Error: El espacio " + espacioValor + " ya está ocupado.");
            return;
        }
    }

    const tipoSeleccionado = document.getElementById("vehiculo1").value;
    const tiposEnMemoria = JSON.parse(localStorage.getItem('tiposVehiculos')) || [];
    const infoTipo = tiposEnMemoria.find(t => t.nombre === tipoSeleccionado);
    
    let precio = infoTipo ? parseFloat(infoTipo.tarifa) : 10;

    const datosVehiculo = {
        nombre: document.getElementById("nombre").value,
        tipo: tipoSeleccionado,
        placa: placaValor,
        precio: precio,
        fecha: document.getElementById("fecha1").value,
        hora: horaValor,
        espacio: espacioValor
    };

    let indiceExistente = vehiculos.findIndex(v => v.placa === placaValor);
    if (indiceExistente !== -1) {
        vehiculos[indiceExistente] = datosVehiculo;
        alert("Datos actualizados.");
    } else {
        vehiculos.push(datosVehiculo);
    }

    localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
    resetearFormulario();
    mostrarVehiculos();
});

function mostrarVehiculos(){
    if(!tablaBody) return;
    tablaBody.innerHTML = "";

    let todosLosEspacios = document.querySelectorAll(".espacio");
    todosLosEspacios.forEach(div => {
        div.className = "espacio libre";
        let n = div.id.split("-")[1];
        div.innerHTML = "<p>Espacio " + n + "</p><p>Libre</p>";
    });

    vehiculos.forEach((v, i) => {
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
    });
}

window.eliminar = function(index) {
    let v = vehiculos[index];
    let ahora = new Date();
    let horaSalida = ahora.getHours() + ":" + (ahora.getMinutes() < 10 ? '0' : '') + ahora.getMinutes();
    
    const tiposEnMemoria = JSON.parse(localStorage.getItem('tiposVehiculos')) || [];
    const infoTipo = tiposEnMemoria.find(t => t.nombre === v.tipo);
    let precioCobro = infoTipo ? parseFloat(infoTipo.tarifa) : v.precio;

    let partesEntrada = v.hora.split(":");
    let minEntrada = (parseInt(partesEntrada[0]) * 60) + parseInt(partesEntrada[1]);
    let minSalida = (ahora.getHours() * 60) + ahora.getMinutes();
  
    let diferencia = minSalida - minEntrada;
    if (diferencia <= 0) { 
        alert("Error: La hora de salida no puede ser anterior o igual a la hora de entrada.");
        return; 
    }
    
    let totalHoras = Math.ceil(diferencia / 60);
    let cobroTotal = totalHoras * precioCobro;

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

    historial.forEach(h => {
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
    });
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

function actualizarSelectDinamico() {
    const select = document.getElementById("vehiculo1");
    if(!select) return;
    const tipos = JSON.parse(localStorage.getItem('tiposVehiculos')) || [];
    select.innerHTML = '<option value="">Seleccione tipo</option>';
    tipos.forEach(t => {
        const op = document.createElement("option");
        op.value = t.nombre;
        op.textContent = `${t.nombre} (Q${t.tarifa})`;
        select.appendChild(op);
    });
}


window.filtrarPorPlaca = function() {
    const input = document.getElementById("buscadorPlaca"); 
    const filtro = input.value.toUpperCase();
    const filas = tablaBody.getElementsByTagName("tr");

    for (let i = 0; i < filas.length; i++) {
        const celdaPlaca = filas[i].getElementsByTagName("td")[2];
        if (celdaPlaca) {
            const texto = celdaPlaca.textContent || celdaPlaca.innerText;
            if (texto.toUpperCase().indexOf(filtro) > -1) {
                filas[i].style.display = "";
            } else {
                filas[i].style.display = "none";
            }
        }
    }
};

window.abrirPerfil = function() {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuario_actual'));
    if (usuarioLogeado) {
        document.getElementById('edit-nombre').value = usuarioLogeado.nombre;
        document.getElementById('edit-email').value = usuarioLogeado.correo;
        document.getElementById('edit-pass').value = usuarioLogeado.pass;
        document.getElementById('modal-perfil').classList.add('activo');
    } else {
        alert("No se encontró sesión activa.");
    }
};

document.getElementById('btn-cerrar-perfil').addEventListener('click', () => {
    document.getElementById('modal-perfil').classList.remove('activo');
});

document.getElementById('form-perfil').addEventListener('submit', function(e) {
    e.preventDefault();
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario_actual'));
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
    
    const nuevosDatos = {
        nombre: document.getElementById('edit-nombre').value,
        correo: document.getElementById('edit-email').value,
        pass: document.getElementById('edit-pass').value
    };

    const index = listaUsuarios.findIndex(u => u.correo === usuarioSesion.correo);
    if (index !== -1) {
        listaUsuarios[index] = nuevosDatos;
        localStorage.setItem('usuarios_sistema', JSON.stringify(listaUsuarios));
    }

    localStorage.setItem('usuario_actual', JSON.stringify(nuevosDatos));
    const displayNombre = document.getElementById('admin-name-display');
    if (displayNombre) displayNombre.textContent = nuevosDatos.nombre;

    alert("Perfil actualizado con éxito.");
    document.getElementById('modal-perfil').classList.remove('activo');
});

window.addEventListener('tipos-actualizados', () => {
    actualizarSelectDinamico();
    mostrarVehiculos(); 
});

fetch("https://api.open-meteo.com/v1/forecast?latitude=14.6407&longitude=-90.5133&current_weather=true")
    .then(respuesta => respuesta.json())
    .then(datos => {
        
        var climaDiv = document.getElementById("info-clima");
        
        if(climaDiv) {
            climaDiv.innerHTML = "Clima: " + datos.current_weather.temperature + "°C <br>" + 
                                 "Tiempo: " + datos.current_weather.time;
        }console.log(datos)
    });