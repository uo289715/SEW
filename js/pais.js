"use strict";
class País {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;           // Nombre del país
        this.capital = capital;         // Nombre de la capital
        this.poblacion = poblacion;     // Cantidad de población
        this.circuitoF1 = null;         // Nombre del circuito de F1 
        this.formaGobierno = null;      // Tipo de forma de gobierno 
        this.coordenadasMeta = null;    // Coordenadas de la línea de meta del circuito 
        this.religionMayoritaria = null;// Religión mayoritaria 
    }

    // Método para rellenar el resto de atributos
    completarAtributos(circuitoF1, formaGobierno, coordenadasMeta, religionMayoritaria) {
        this.circuitoF1 = circuitoF1;
        this.formaGobierno = formaGobierno;
        this.coordenadasMeta = coordenadasMeta;
        this.religionMayoritaria = religionMayoritaria;
    }

   // Método que devuelve el nombre del país como cadena de texto
    getNombre() {
        return `Nombre del país: ${this.nombre}`;
    }

    // Método que devuelve la capital del país como cadena de texto
    getCapital() {
        return `Capital del país: ${this.capital}`;
    }

    // Método para escribir el nombre del país y la capital en el documento
    escribirInfoPrincipal() {
        document.write(`<p>${this.getNombre()}</p>`);
        document.write(`<p>${this.getCapital()}</p>`);
    }

    // Método para escribir la información secundaria en el documento como lista HTML
    escribirInfoSecundaria() {
        document.write(`
            <ul>
                <li>Nombre del circuito de F1: ${this.circuitoF1}</li>
                <li>Población: ${this.poblacion}</li>
                <li>Forma de gobierno: ${this.formaGobierno}</li>
                <li>Religión mayoritaria: ${this.religionMayoritaria}</li>
            </ul>
        `);
    }

    // Método para escribir las coordenadas de la línea de meta en el documento HTML
    escribirCoordenadasMeta() {
        if (this.coordenadasMeta) {
            document.write(`<p>Coordenadas de la línea de meta: ${this.coordenadasMeta}</p>`);
        } else {
            document.write("<p>Coordenadas de la línea de meta no disponibles.</p>");
        }
    }
    obtenerPrevisionTiempo(apiKey) {
        if (!this.coordenadasMeta) {
            console.error("Coordenadas no disponibles.");
            return;
        }
    
        const [lat, lon] = this.coordenadasMeta.split(" ");
        const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
        const queryURL = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&mode=xml&lang=es&units=metric`;
    
        $.ajax({
            dataType: "xml",
            url: queryURL,
            method: 'GET',
            success: function (datos) {    
                // Crear un contenedor <article> para todos los artículos
                const title = $('<h1>Previsión para los próximos 5 días en Silverstone</h1>');

                $("body").append(title);

                const container = $('<article></article>');
                const today = new Date();
        
                // Iterar sobre las etiquetas <time> en el XML
                $('time', datos).each(function (index) {
                    if (index >= 5) return false; // Solo queremos los próximos 5 días
        
                    const forecastDate = new Date(today);
                    forecastDate.setDate(today.getDate() + index);

                    const formattedDate = forecastDate.toLocaleDateString("es-ES");
                    const tempMin = $(this).find('temperature').attr('min'); // Temperatura mínima
                    const tempMax = $(this).find('temperature').attr('max'); // Temperatura máxima
                    const humidity = $(this).find('humidity').attr('value'); // Humedad
                    const rain = $(this).find('precipitation').attr('value') || 0; // Lluvia
                    const weatherIcon = $(this).find('symbol').attr('var'); // Icono del tiempo
        
                    // Crear un artículo para el pronóstico diario
                    const article = $(`
                        <article>
                            <h2>Fecha: ${formattedDate}</h2>
                            <p>Temperatura máxima: ${tempMax} °C</p>
                            <p>Temperatura mínima: ${tempMin} °C</p>
                            <p>Humedad: ${humidity}%</p>
                            <p>Cantidad de lluvia: ${rain} mm</p>
                            <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Icono del tiempo">
                        </article>
                    `);
        
                    // Agregar el artículo al contenedor
                    container.append(article);
                });
        
                // Agregar el contenedor de artículos al body
                $("body").append(container);
            },
            error: function () {
                console.error("Error al obtener los datos del tiempo.");
                const errorMsg = $("<p>Error al obtener la previsión del tiempo. Por favor, revisa la conexión o clave API.</p>");
                $("body").append(errorMsg);
            }
        });
        
    }
    
    

    // Método para escribir toda la información en el documento
    escribirInformacionCompleta(apiKey) {
        this.escribirInfoPrincipal();
        this.escribirInfoSecundaria();
        this.escribirCoordenadasMeta();
        this.obtenerPrevisionTiempo(apiKey);

    }
}
var granBretana = new País("Gran Bretaña", "Londres", 65121000);
granBretana.completarAtributos(
    "Silverstone Circuit",         
    "Monarquía constitucional",     
    "52.069229 -1.022245",            
    "Cristianismo"                 
);

// Escribir toda la información del país en el documento HTML
const apiKey = "c59ed51647296b593ab3b397488fb503";
granBretana.escribirInformacionCompleta(apiKey);