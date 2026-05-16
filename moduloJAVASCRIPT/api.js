fetch("https://api.open-meteo.com/v1/forecast?latitude=14.6407&longitude=-90.5133&current_weather=true")
    .then(respuesta => respuesta.json())
    .then(datos => {
        
        var climaDiv = document.getElementById("info-clima");
        
        if(climaDiv) {
            climaDiv.innerHTML = "Clima: " + datos.current_weather.temperature + "°C <br>" + 
                                 "Tiempo: " + datos.current_weather.time;
        }console.log(datos)
    });