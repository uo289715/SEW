"use strict";

class Viajes {
  constructor() {
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    this.initMapDinamico();
    this.cargarFotosFlickr(); // Llamamos la función para cargar las fotos de Flickr
  }

  // Función que obtiene las coordenadas del usuario
  getPosicion(posicion) {
    this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
    this.longitud = posicion.coords.longitude;
    this.latitud = posicion.coords.latitude;
    this.precision = posicion.coords.accuracy;
    this.altitud = posicion.coords.altitude;
    this.precisionAltitud = posicion.coords.altitudeAccuracy;
    this.rumbo = posicion.coords.heading;
    this.velocidad = posicion.coords.speed;
  }

  // Función que maneja los errores de geolocalización
  verErrores(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.mensaje = "El usuario no permite la petición de geolocalización";
        break;
      case error.POSITION_UNAVAILABLE:
        this.mensaje = "Información de geolocalización no disponible";
        break;
      case error.TIMEOUT:
        this.mensaje = "La petición de geolocalización ha caducado";
        break;
      case error.UNKNOWN_ERROR:
        this.mensaje = "Se ha producido un error desconocido";
        break;
    }
  }

  // Función para mostrar las fotos de Flickr y agregar el carrusel
  cargarFotosFlickr() {
    fetch('viajes.php?json=1')  // Ahora pasamos el parámetro 'json=1'
      .then(response => response.json())  // Convertir la respuesta a JSON
      .then(fotos => {
        this.mostrarFotos(fotos); // Mostrar las fotos
        this.iniciarCarrusel(); // Iniciar el carrusel
      })
      .catch(error => console.log('Error al cargar las imágenes:', error));
  }

  mostrarFotos(fotos) {
    const contenedorCarrusel = document.querySelector("article");
  
    // Filtrar fotos con título vacío o sólo espacios
    fotos = fotos.filter(foto => foto.titulo.trim() !== "");
  
    // Crear el carrusel con las imágenes
    fotos.forEach(foto => {
      const imgElement = document.createElement("img");
      imgElement.src = foto.url;
      imgElement.alt = foto.titulo || "Imagen sin título";  // Si no hay título, colocar uno por defecto
      contenedorCarrusel.appendChild(imgElement);
    });
  }

  // Función para iniciar el carrusel
  iniciarCarrusel() {
    const slides = document.querySelectorAll("img");

    // Botones de navegación
    const nextSlide = document.querySelector("button:nth-of-type(1)");
    const prevSlide = document.querySelector("button:nth-of-type(2)");

    // Contador de la diapositiva actual
    let curSlide = 4;
    const maxSlide = slides.length - 1;

    // Función para mover las diapositivas al siguiente
    nextSlide.addEventListener("click", function () {
      if (curSlide === maxSlide) {
        curSlide = 0;
      } else {
        curSlide++;
      }

      // Mover las diapositivas
      slides.forEach((slide, indx) => {
        var trans = 100 * (indx - curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)');
      });
    });

    // Función para mover las diapositivas al anterior
    prevSlide.addEventListener("click", function () {
      if (curSlide === 0) {
        curSlide = maxSlide;
      } else {
        curSlide--;
      }

      // Mover las diapositivas
      slides.forEach((slide, indx) => {
        var trans = 100 * (indx - curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)');
      });
    });
  }

  // Función para mostrar la ubicación geográfica en la página
  verTodo(dondeVerlo) {
    var ubicacion = document.getElementById(dondeVerlo);
    var datos = '<p>' + this.mensaje + '</p>';
    datos += '<p>Longitud: ' + this.longitud + ' grados</p>';
    datos += '<p>Latitud: ' + this.latitud + ' grados</p>';
    datos += '<p>Precisión de la longitud y latitud: ' + this.precision + ' metros</p>';
    datos += '<p>Altitud: ' + this.altitud + ' metros</p>';
    datos += '<p>Precisión de la altitud: ' + this.precisionAltitud + ' metros</p>';
    datos += '<p>Rumbo: ' + this.rumbo + ' grados</p>';
    datos += '<p>Velocidad: ' + this.velocidad + ' metros/segundo</p>';
    ubicacion.innerHTML = datos;
  }

  // Función para obtener y mostrar el mapa estático de Google
  getMapaEstaticoGoogle(dondeVerlo) {
    var ubicacion = document.querySelector("div");
    var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
    var url = "https://maps.googleapis.com/maps/api/staticmap?";
    var centro = "center=" + this.latitud + "," + this.longitud;
    var zoom = "&zoom=15";
    var tamaño = "&size=800x600";
    var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
    var sensor = "&sensor=false";
    
    this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
    ubicacion.innerHTML = "<img src='" + this.imagenMapa + "' alt='mapa estático google' />";
  }

  // Función para inicializar el mapa dinámico
  initMapDinamico() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidW8yODk3MTUiLCJhIjoiY200aThubGszMGNzODJpczRmZ3hhajF2cyJ9.nweo4jHrhyrzbhnxSK9k4g';
    this.mapa = new mapboxgl.Map({
      container: document.getElementsByTagName('div')[1],
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-5.8502461, 43.3672702],
      zoom: 7
    });
  }
}

var miMapa = new Viajes();
