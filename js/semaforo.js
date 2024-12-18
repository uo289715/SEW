class Semaforo {
    // Atributos de la clase
    levels = [0.2, 0.5, 0.8];  // Dificultades del juego
    lights = 4;                 // Número de luces del semáforo
    unload_moment = null;       // Momento en el que se inicia el apagado del semáforo
    clic_moment = null;         // Momento en el que el usuario presiona el botón

    // Constructor de la clase Semáforo
    constructor() {
        this.difficulty = this.initializeDifficulty(); // Inicializa la dificultad
        this.createStructure(); // Llama al método para crear la estructura en el HTML
    }

    // Método para inicializar la dificultad aleatoriamente
    initializeDifficulty() {
        // Generar un número aleatorio entre 0 y 3 (excluyendo 3)
        const randomIndex = Math.floor(Math.random() * 3);
        // Asignar la dificultad correspondiente desde el array 'levels'
        return this.levels[randomIndex];
    }

    // Método para crear la estructura HTML dentro de <main>
    createStructure() {
        // Obtener la etiqueta <main> donde se insertará la estructura
        const main = document.querySelector("main");

        // Crear un encabezado para el título del juego
        const header = document.createElement("h2");
        header.innerText = "Juego del Semáforo";
        main.appendChild(header); // Añadir el encabezado al <main>


        // Crear tantos divs para las luces como el valor de 'lights'
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement("div");
            light.dataset.state = "off"; // Iniciar las luces apagadas
            document.querySelector("main").appendChild(light); // Añadir la luz al contenedor
        }

        // Crear el botón para arrancar el semáforo
        const startButton = document.createElement("button");
        startButton.innerText = "Arrancar Semáforo";
        startButton.onclick = () => this.initSequence(); // Asignar el evento para iniciar la secuencia
        main.appendChild(startButton); // Añadir el botón al <main>

        // Crear el botón para obtener el tiempo de reacción
        const reactionButton = document.createElement("button");
        reactionButton.innerText = "Obtener Tiempo de Reacción";
        reactionButton.onclick = () => this.stopReaction();
        main.appendChild(reactionButton); // Añadir el botón al <main>
    }

    // Método para iniciar la secuencia de encendido y apagado
    initSequence() {
        const main = document.querySelector("main");

        this.resetGame();

        // Añadir la clase 'load' al main para comenzar la animación de encendido
        main.classList.add("load");

        // Desactivar el botón de arranque
        const startButton = main.querySelector("button:first-of-type");
        startButton.disabled = true;

        // Establecer un retraso para el apagado basado en la dificultad
        const timeout = this.difficulty * 100 + 2000;  // La dificultad se multiplica por 100

        setTimeout(() => {
            // Guardar el momento de apagado
            this.unload_moment = new Date();

            // Llamar al método para finalizar la secuencia
            this.endSequence();
        }, timeout);
    }

    // Método para finalizar la secuencia de luces
    endSequence() {
        const main = document.querySelector("main");

        // Añadir la clase 'unload' al main para comenzar la animación de apagado
        main.classList.add("unload");

        // Habilitar el botón para obtener el tiempo de reacción
        const reactionButton = main.querySelector("button:nth-of-type(2)");
        reactionButton.disabled = false;
    }

    // Método para registrar y mostrar el tiempo de reacción
    stopReaction() {
        const main = document.querySelector("main");

        // Obtener el momento en que el usuario hace clic en el botón de "Reacción"
        this.clic_moment = new Date();

        // Calcular la diferencia en milisegundos entre el apagado del semáforo y el clic del usuario
        const reactionTime = this.clic_moment.getTime() - this.unload_moment.getTime();

        // Redondear el tiempo de reacción a 3 decimales
        const roundedReactionTime = (reactionTime / 1000).toFixed(3); // Convertir a segundos y redondear a 3 decimales

        // Crear un párrafo para mostrar el tiempo de reacción
        const resultParagraph = document.createElement("p");
        resultParagraph.innerText = `Tu tiempo de reacción es: ${roundedReactionTime} segundos`;
        main.appendChild(resultParagraph);

        // Quitar las clases 'load' y 'unload' del main
        main.classList.remove("load", "unload");

        // Deshabilitar el botón "Reacción"
        const reactionButton = main.querySelector("button:nth-of-type(2)");
        reactionButton.disabled = true;

        // Habilitar el botón de "Arrancar" para reiniciar el juego
        const startButton = main.querySelector("button:first-of-type");
        startButton.disabled = false;

        this.createRecordForm(roundedReactionTime); // Llama al método para crear el formulario
    }

    resetGame() {
        const main = document.querySelector("main");

        // Eliminar el párrafo con el tiempo de reacción
        const resultParagraph = main.querySelector("p");
        if (resultParagraph) {
            resultParagraph.remove();
        }
        const form = main.querySelector("form");
        if (form) {
            form.remove();
        }
        const top10Section = main.querySelector("article");
        if (top10Section) {
            top10Section.remove();
        }

        // Activar el botón "Arrancar Semáforo" y deshabilitar el de "Obtener Tiempo de Reacción"
        const startButton = main.querySelector("button:first-of-type");
        startButton.disabled = false;

        const reactionButton = main.querySelector("button:nth-of-type(2)");
        reactionButton.disabled = true;

        // Limpiar las clases para reiniciar la animación
        main.classList.remove("load", "unload");
    }

    createRecordForm(reactionTime) {
        const main = document.querySelector("main");
    
        // Crear el formulario
        const form = document.createElement("form");
        form.method = "POST";  // Asegúrate de que el método sea POST
        form.action = "semaforo.php"; // El archivo PHP que manejará la inserción en la base de datos    
    
        // Crear el campo Nombre
        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Nombre:";
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = "nombre";
        nameInput.required = true;
    
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
    
        // Crear el campo Apellidos
        const lastNameLabel = document.createElement("label");
        lastNameLabel.textContent = "Apellidos:";
        const lastNameInput = document.createElement("input");
        lastNameInput.type = "text";
        lastNameInput.name = "apellidos";
        lastNameInput.required = true;
    
        form.appendChild(lastNameLabel);
        form.appendChild(lastNameInput);
    
        // Crear el campo Nivel
        const levelLabel = document.createElement("label");
        levelLabel.textContent = "Nivel:";
        const levelInput = document.createElement("input");
        levelInput.type = "text";
        levelInput.name = "nivel";
        levelInput.value = this.difficulty;
        levelInput.readOnly = true;
    
        form.appendChild(levelLabel);
        form.appendChild(levelInput);
    
        // Crear el campo Tiempo de Reacción
        const timeLabel = document.createElement("label");
        timeLabel.textContent = "Tiempo de Reacción (s):";
        const timeInput = document.createElement("input");
        timeInput.type = "text";
        timeInput.name = "tiempo";
        timeInput.value = reactionTime;
        timeInput.readOnly = true;
    
        form.appendChild(timeLabel);
        form.appendChild(timeInput);
    
        // Crear el botón de envío
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Guardar Registro";
    
        form.appendChild(submitButton);
    
        // Añadir el formulario directamente al main
        main.appendChild(form);
        // Enviar el formulario con AJAX
        form.onsubmit = (e) => {
        e.preventDefault(); // Prevenir que el formulario se envíe de la forma tradicional

        const formData = new FormData(form);  // Crear un objeto FormData con los datos del formulario

        // Enviar los datos mediante AJAX (fetch API)
        fetch(form.action, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())  // Esperar la respuesta como JSON
        .then(data => {
            // Mostrar los 10 mejores resultados
            this.displayTop10(data);
        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
        });
    };
    }
    // Método para mostrar el Top 10 debajo del semáforo
    displayTop10(records) {
    const main = document.querySelector("main");

    // Crear una nueva sección para el Top 10
    const top10Section = document.createElement("article");
    top10Section.id = "top-10";
    top10Section.innerHTML = "<h3>Top 10 Registros</h3>";

    // Crear una lista ordenada (ol) para los registros
    const list = document.createElement("ol");

    // Recorrer los registros y agregar cada uno a la lista
    records.forEach(record => {
        const listItem = document.createElement("li");
        listItem.textContent = `${record.nombre} ${record.apellidos} - ${record.tiempo} segundos`;
        list.appendChild(listItem);
    });

    top10Section.appendChild(list);

    // Añadir la sección al main
    main.appendChild(top10Section);
}
    
    
}
