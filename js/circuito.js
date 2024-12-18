class Circuito {
    constructor() {  
      // Asociar el evento al input de archivo
      const inputArchivo = document.querySelectorAll("input[type='file']")[0];
      inputArchivo.addEventListener("change", (event) => {
        const archivos = event.target.files;
        this.procesarArchivo(archivos);
      });

      const inputKML = document.querySelectorAll("input[type='file']")[1];
      inputKML.addEventListener("change", (event) => {
      const archivos = event.target.files;
      this.procesarKML(archivos);
      });

      const inputSVG = document.querySelectorAll("input[type='file']")[2];
      inputSVG.addEventListener("change", (event) => {
          const archivos = event.target.files;
          this.procesarSVG(archivos);
      });
    }
  
    procesarSVG(files) {
      const archivo = files[0];
      if (!archivo) return;

      // Validar que el archivo sea de tipo SVG
      if (archivo.type !== 'image/svg+xml') {
        const mensajeError = document.createElement("p");
        mensajeError.textContent = "Error: ¡¡¡ El archivo no es un archivo SVG válido !!!";
        document.body.appendChild(mensajeError);
        return;
    }

    // Leer el contenido del archivo SVG
    const lector = new FileReader();
    lector.onload = (evento) => {
        const contenido = evento.target.result;

        // Insertar el contenido SVG directamente en el body
        document.body.insertAdjacentHTML('beforeend', contenido);
    };

    lector.readAsText(archivo);
    }
    procesarArchivo(files) {
      const archivo = files[0];
      if (!archivo) return;
  
      // Validar que el archivo sea de tipo XML
      const tipoXML = /xml/;
      const errorLectura = document.createElement("p");
      if (!archivo.type.match(tipoXML)) {
        errorLectura.textContent = "Error: ¡¡¡ Archivo no válido !!!";
        return;
      }
  
      errorLectura.textContent = ""; // Limpiar errores previos
  
      // Leer el contenido del archivo
      const lector = new FileReader();
      const contenidoArchivo = document.createElement("p");
      const areaVisualizacion = document.createElement("p");
      lector.onload = (evento) => {
        const contenido = evento.target.result;
  
        // Mostrar el contenido sin procesar
        contenidoArchivo.textContent = "Contenido del archivo XML:";
        areaVisualizacion.textContent = contenido;
  
        // Procesar y mostrar el contenido XML
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(contenido, "application/xml");
  
          this.mostrarXML(xmlDoc);
        } catch (error) {
          areaVisualizacion.textContent = "Error al procesar el archivo XML.";
        }
      };
  
      lector.readAsText(archivo);
    }
  
    iniciarMapa() {
        // Configurar Mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yODk3MTUiLCJhIjoiY200aThubGszMGNzODJpczRmZ3hhajF2cyJ9.nweo4jHrhyrzbhnxSK9k4g';
        const divMapa = document.createElement('div');

        document.body.appendChild(divMapa);

        this.mapa = new mapboxgl.Map({
          container: divMapa,
          style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
          center: [-1.0166666, 52.075], // Coordenadas iniciales 
          zoom: 13, // Nivel de zoom inicial
          interactive: true 
        }); 
        this.mapa.scrollZoom.enable();    // Permite zoom con la rueda del ratón
        this.mapa.dragPan.enable();       // Permite arrastrar el mapa
        this.mapa.keyboard.enable();      // Permite interacción con el teclado
        this.mapa.doubleClickZoom.enable(); // Permite zoom con doble clic

    }

    mostrarXML(xmlDoc) {
        const areaVisualizacion = document.querySelector("body");
    
        // Crear una lista para mostrar el contenido XML
        const elementos = xmlDoc.documentElement.children;
        const lista = document.createElement("ul");
    
        for (const elemento of elementos) {
          const item = document.createElement("li");
          item.innerHTML = `<strong>${elemento.tagName}:</strong> ${elemento.textContent}`;
          lista.appendChild(item);
        }
    
        // Limpiar el área de visualización y mostrar el contenido procesado
        areaVisualizacion.appendChild(lista);
    }
     // Procesar archivo KML
     procesarKML(files) {
        const archivo = files[0];
        if (!archivo) return;

        // Validar que el archivo sea de tipo KML
        const nombreArchivo = archivo.name.toLowerCase();
        if (!nombreArchivo.endsWith('.kml')) {
            const mensajeError = document.createElement("p");
            mensajeError.textContent = "Error: ¡¡¡ El archivo no es un archivo KML válido !!!";
            document.body.appendChild(mensajeError);
            return;
        }

        // Leer el contenido del archivo
        const lector = new FileReader();
        lector.onload = (evento) => {
            const contenido = evento.target.result;

            // Convertir el KML a un documento XML
            const kml = new DOMParser().parseFromString(contenido, 'text/xml');

            // Extraer las coordenadas
            const coordenadas = this.extraerCoordenadas(kml);
            if (coordenadas.length > 0) {
                // Inicializar el mapa
                this.iniciarMapa();
                this.agregarCoordenadasAlMapa(coordenadas);
            } else {
                alert("No se encontraron coordenadas en el archivo KML.");
            }
        };

        lector.readAsText(archivo);
        
    }

    // Extraer las coordenadas de un documento KML
    extraerCoordenadas(kmlDoc) {
        const coordenadas = [];
        const elementos = kmlDoc.getElementsByTagName("coordinates");

        for (let i = 0; i < elementos.length; i++) {
            const coordsText = elementos[i].textContent.trim();
            const puntos = coordsText.split(/\s+/);

            puntos.forEach((punto) => {
                const [lon, lat] = punto.split(",").map(parseFloat);
                if (!isNaN(lon) && !isNaN(lat)) {
                    coordenadas.push([lon, lat]);
                }
            });
        }

        return coordenadas;
    }

    // Agregar las coordenadas al mapa
    agregarCoordenadasAlMapa(coordenadas) {
      // Escuchar el evento 'load' del mapa
      this.mapa.on('load', () => {
          // Crear una fuente GeoJSON para las coordenadas
          const geojson = {
              'type': 'FeatureCollection',
              'features': [
                  {
                      'type': 'Feature',
                      'geometry': {
                          'type': 'LineString',
                          'coordinates': coordenadas // Conectar todas las coordenadas
                      }
                  }
              ]
          };
  
          // Agregar la fuente al mapa
          this.mapa.addSource('linea-coordenadas', {
              'type': 'geojson',
              'data': geojson
          });
  
          // Crear una capa de línea para visualizar las coordenadas conectadas
          this.mapa.addLayer({
              'id': 'linea-coordenadas-layer',
              'type': 'line',
              'source': 'linea-coordenadas',
              'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
              },
              'paint': {
                  'line-color': '#FF0000', // Color de la línea
                  'line-width': 4 // Ancho de la línea
              }
          });
  
          const bounds = coordenadas.reduce(
            (bounds, coord) => bounds.extend(coord),
            new mapboxgl.LngLatBounds(coordenadas[0], coordenadas[0])
        );

        // Ajustar los límites con un zoom máximo
        this.mapa.fitBounds(bounds, { padding: 50, maxZoom: 15 }); // Limita el zoom para evitar bloqueos
      });
    }
}
  // Instanciar la clase Circuito al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    new Circuito();
  });
  