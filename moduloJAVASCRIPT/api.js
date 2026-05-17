async function cargarClimaDeGuate() {
    var divClima = document.getElementById("info-clima");
    divClima.innerHTML = "Cargando datos...";

    await new Promise(function(resolve) {
        setTimeout(resolve, 2000);
    });

    try {
        var respuesta = await fetch("https://api.open-meteo.com/v1/forecast?latitude=14.6407&longitude=-90.5133&current_weather=true");
        var datos = await respuesta.json();
        
        var temperatura = datos.current_weather.temperature;
        var hora = datos.current_weather.time;

        divClima.innerHTML = "<div style='color: white;'>Temperatura: " + temperatura + "°C <br> Hora: " + hora + "</div>";
        
        console.log("¡Clima cargado con éxito!");

    } catch (error) {
        console.log("Hubo un error con la API");
        divClima.innerHTML = "No se pudo cargar el clima";
    }
}
cargarClimaDeGuate();