class Agenda {
    constructor() {
        // URL de la API de Ergast para obtener las carreras de la temporada en curso
        this.url = "https://ergast.com/api/f1/current.json";
        this.obtenerCarreras();
    }

    // Método para obtener la información de las carreras
    obtenerCarreras() {
        // Realizamos una solicitud a la API de Ergast usando fetch
        fetch(this.url)
            .then(response => response.json()) // Convertimos la respuesta a formato JSON
            .then(data => {
                // Procesamos los datos de las carreras
                this.mostrarCarreras(data);
            })
            .catch(error => {
                console.error("Error al obtener las carreras:", error);
            });
    }

    // Método para mostrar las carreras como artículos dentro de un artículo principal
    mostrarCarreras(data) {
        // Accedemos a las carreras de la temporada actual
        const carreras = data.MRData.RaceTable.Races;

        // Creamos el contenedor principal como un <article>
        const contenedorPrincipal = document.createElement('article');
        contenedorPrincipal.className = 'calendario-carreras'; // Clase para estilizar el contenedor principal
        document.body.appendChild(contenedorPrincipal); // Agregamos el contenedor al cuerpo del documento

        if (carreras.length === 0) {
            // Si no hay carreras, mostramos un mensaje
            const mensaje = document.createElement('p');
            mensaje.textContent = "No hay carreras programadas para esta temporada.";
            contenedorPrincipal.appendChild(mensaje);
            return;
        }

        // Iteramos sobre las carreras y creamos subartículos para cada una
        carreras.forEach(carrera => {
            const subArticulo = document.createElement('article'); // Creamos un subartículo para cada carrera
            subArticulo.className = 'carrera'; // Clase para el subartículo
            
            // Título del Gran Premio
            const titulo = document.createElement('h3');
            titulo.textContent = `Gran Premio: ${carrera.raceName}`;
            subArticulo.appendChild(titulo);

            // Fecha de la carrera
            const fecha = document.createElement('p');
            fecha.textContent = `Fecha: ${carrera.date}`;
            subArticulo.appendChild(fecha);

            // Nombre del circuito
            const circuito = document.createElement('p');
            circuito.textContent = `Circuito: ${carrera.Circuit.circuitName}`;
            subArticulo.appendChild(circuito);

            // Ubicación del circuito
            const ubicacion = document.createElement('p');
            ubicacion.textContent = `Ubicación: ${carrera.Circuit.Location.locality}, ${carrera.Circuit.Location.country}`;
            subArticulo.appendChild(ubicacion);

            // Agregamos el subartículo al contenedor principal
            contenedorPrincipal.appendChild(subArticulo);
        });
    }
}

// Instanciamos la clase Agenda para que se ejecute al cargar el script
new Agenda();
