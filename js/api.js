// Variables globales para manejar el estado del juego
let tiempoRestante = 60; // 60 segundos en total para todas las preguntas
let puntaje = parseInt(localStorage.getItem("puntajeTotal")) || 0; // Puntaje total acumulado a lo largo de todas las rondas, desde localStorage
let puntajeRonda = 0; // Puntaje de la ronda actual
let indicePregunta = 0;
let temporizadorGlobal = null;
const totalPreguntas = 5; // Número de preguntas por ronda

// Lista de preguntas del juego
const preguntas = [
    {
        pregunta: "¿Quién ganó el Gran Premio de Mónaco en 2022?",
        opciones: ["Lewis Hamilton", "Charles Leclerc", "Sergio Pérez", "Max Verstappen"],
        respuestaCorrecta: "Sergio Pérez"
    },
    {
        pregunta: "¿En qué año debutó Fernando Alonso en la F1?",
        opciones: ["2001", "2003", "2005", "2007"],
        respuestaCorrecta: "2001"
    },
    {
        pregunta: "¿Cuántos campeonatos mundiales ha ganado Michael Schumacher?",
        opciones: ["5", "7", "9", "10"],
        respuestaCorrecta: "7"
    },
    {
        pregunta: "¿Quién tiene más victorias en la historia de la F1?",
        opciones: ["Lewis Hamilton", "Michael Schumacher", "Sebastian Vettel", "Alain Prost"],
        respuestaCorrecta: "Lewis Hamilton"
    },
    {
        pregunta: "¿En qué año se fundó la Fórmula 1?",
        opciones: ["1947", "1950", "1962", "1965"],
        respuestaCorrecta: "1950"
    },
    {
        pregunta: "¿Cuál es la escudería más exitosa en la historia de la F1?",
        opciones: ["Ferrari", "Mercedes", "Red Bull", "McLaren"],
        respuestaCorrecta: "Ferrari"
    },
    {
        pregunta: "¿Quién es el piloto más joven en ganar un campeonato mundial de F1?",
        opciones: ["Sebastian Vettel", "Lewis Hamilton", "Fernando Alonso", "Max Verstappen"],
        respuestaCorrecta: "Sebastian Vettel"
    },
    {
        pregunta: "¿Qué circuito alberga el Gran Premio de Italia?",
        opciones: ["Monza", "Silverstone", "Spa-Francorchamps", "Suzuka"],
        respuestaCorrecta: "Monza"
    },
    {
        pregunta: "¿Cuál es el récord de victorias de un piloto en una temporada?",
        opciones: ["7", "13", "10", "11"],
        respuestaCorrecta: "13"
    },
    {
        pregunta: "¿En qué país se celebra el Gran Premio de Azerbaiyán?",
        opciones: ["Azerbaiyán", "Rusia", "Canadá", "Francia"],
        respuestaCorrecta: "Azerbaiyán"
    },
    {
        pregunta: "¿Quién es el piloto con más poles en la F1?",
        opciones: ["Lewis Hamilton", "Michael Schumacher", "Juan Manuel Fangio", "Sebastian Vettel"],
        respuestaCorrecta: "Lewis Hamilton"
    },
    {
        pregunta: "¿Qué equipo ganó el campeonato de constructores en 2021?",
        opciones: ["Red Bull Racing", "Mercedes", "Ferrari", "McLaren"],
        respuestaCorrecta: "Mercedes"
    },
    {
        pregunta: "¿Cuántos Grandes Premios se celebran actualmente en la temporada de F1?",
        opciones: ["16", "18", "22", "24"],
        respuestaCorrecta: "22"
    },
    {
        pregunta: "¿Qué piloto obtuvo el campeonato de F1 en 2020?",
        opciones: ["Max Verstappen", "Lewis Hamilton", "Valtteri Bottas", "Sergio Pérez"],
        respuestaCorrecta: "Lewis Hamilton"
    },
    {
        pregunta: "¿Qué piloto tiene el récord de más victorias en el Gran Premio de España?",
        opciones: ["Fernando Alonso", "Michael Schumacher", "Lewis Hamilton", "Sebastian Vettel"],
        respuestaCorrecta: "Fernando Alonso"
    },
    {
        pregunta: "¿Qué piloto ganó el Gran Premio de Alemania en 2019?",
        opciones: ["Sebastian Vettel", "Lewis Hamilton", "Max Verstappen", "Charles Leclerc"],
        respuestaCorrecta: "Max Verstappen"
    }
];

// Función para mezclar las preguntas (Algoritmo de Fisher-Yates)
function mezclarPreguntas(preguntas) {
    for (let i = preguntas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preguntas[i], preguntas[j]] = [preguntas[j], preguntas[i]];
    }
    return preguntas;
}

// Función para iniciar el juego
function iniciarJuego() {
    // Seleccionamos 5 preguntas aleatorias
    const preguntasSeleccionadas = mezclarPreguntas(preguntas).slice(0, totalPreguntas);
    
    
    // Iniciar el temporizador global
    iniciarTemporizador();
    mostrarPregunta(preguntasSeleccionadas);
}

// Función para iniciar el temporizador global (de 60 segundos para todas las preguntas)
function iniciarTemporizador() {
    // Limpiar cualquier temporizador previo si existiera
    if (temporizadorGlobal) {
        clearInterval(temporizadorGlobal);
    }

    // Crear el temporizador
    const temporizadorElemento = document.createElement("p");
    document.body.appendChild(temporizadorElemento);

    // Iniciar el temporizador global
    temporizadorGlobal = setInterval(() => {
        if (tiempoRestante > 0) {
            temporizadorElemento.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
            tiempoRestante--;
        } else {
            clearInterval(temporizadorGlobal); // Detener el temporizador
            mostrarFinJuego(); // Finalizar el juego cuando el tiempo se agote
        }
    }, 1000);
}

// Función para mostrar la pregunta y sus opciones
function mostrarPregunta(preguntas) {
    // Limpiar el artículo de la pregunta anterior
    const preguntaAnterior = document.querySelector("article");
    if (preguntaAnterior) {
        preguntaAnterior.remove();
    }

    // Crear un nuevo artículo para la nueva pregunta
    const article = document.createElement("article");
    document.body.appendChild(article);

    const preguntaObj = preguntas[indicePregunta];
    const pregunta = preguntaObj.pregunta;
    const opciones = preguntaObj.opciones;

    // Mostrar la pregunta
    const parrafoPregunta = document.createElement("p");
    parrafoPregunta.textContent = pregunta;
    article.appendChild(parrafoPregunta);

    // Mostrar las opciones
    opciones.forEach((opcion, index) => {
        const boton = document.createElement("button");
        boton.textContent = opcion;
        boton.setAttribute('data-index', index); // Para identificar el índice del botón
        boton.addEventListener("click", (event) => validarRespuesta(event, article, preguntas));
        article.appendChild(boton);
    });
}


// Función para validar la respuesta seleccionada
function validarRespuesta(event, article, preguntas) {
    const opcionSeleccionada = event.target.textContent;
    const respuestaCorrecta = preguntas[indicePregunta].respuestaCorrecta;

    // Deshabilitar los botones de opciones
    const botones = article.querySelectorAll("button");
    botones.forEach(boton => boton.disabled = true);

    // Reproducir sonido de retroalimentación
    const audio = new Audio();
    if (opcionSeleccionada === respuestaCorrecta) {
        audio.src = 'multimedia/audios/acierto.mp3'; // Sonido de respuesta correcta
        puntajeRonda += 1; // Incrementar puntaje de la ronda
        puntaje += 1; // Incrementar puntaje total
    } else {
        audio.src = 'multimedia/audios/error.mp3'; // Sonido de respuesta incorrecta
    }

    // Ajustar volumen del audio
    audio.volume = 0.05;
    audio.play();

    // Mostrar el puntaje de la ronda y el total
    mostrarPuntaje();

    // Crear un párrafo para mostrar la respuesta correcta o incorrecta
    const mensajeRespuesta = document.createElement("p");
    if (opcionSeleccionada === respuestaCorrecta) {
        mensajeRespuesta.textContent = "¡Respuesta correcta!";
        mensajeRespuesta.style.color = "green";
    } else {
        mensajeRespuesta.textContent = "¡Respuesta incorrecta!";
        mensajeRespuesta.style.color = "red";
    }
    article.appendChild(mensajeRespuesta);

    // Mostrar la respuesta correcta debajo de la pregunta
    const respuestaCorrectaElemento = document.createElement("p");
    respuestaCorrectaElemento.textContent = `Respuesta correcta: ${respuestaCorrecta}`;
    article.appendChild(respuestaCorrectaElemento);

    // Esperar 2 segundos antes de pasar a la siguiente pregunta
    setTimeout(() => {
        indicePregunta++;
        if (indicePregunta < preguntas.length) {
            mostrarPregunta(preguntas);
        } else {
            clearInterval(temporizadorGlobal); // Detener el temporizador al final del juego
            mostrarFinJuego();
        }
    }, 2000); // Espera de 2 segundos
}

// Función para inicializar el puntaje en el documento
function inicializarPuntaje() {
    // Crear un párrafo para el puntaje
    const parrafoPuntaje = document.createElement("p");
    const titulo=document.createElement('h2');
    titulo.textContent="F1 Trivia";
    document.body.appendChild(titulo);
    document.body.appendChild(parrafoPuntaje);
    mostrarPuntaje(parrafoPuntaje); // Muestra el puntaje al inicio
}

// Función para mostrar el puntaje
function mostrarPuntaje() {
    let parrafoPuntaje = document.querySelectorAll("p")[1]; // Seleccionamos el primer párrafo disponible

    // Si no existe un párrafo para el puntaje, lo creamos
    if (!parrafoPuntaje) {
        parrafoPuntaje = document.createElement("p");
        document.body.appendChild(parrafoPuntaje);
    }

    // Actualizar el contenido del párrafo con el puntaje total y el puntaje de la ronda
    parrafoPuntaje.textContent = `Puntaje total: ${puntaje} | Puntaje de la ronda: ${puntajeRonda}`;

    // Guardar el puntaje total en localStorage
    localStorage.setItem("puntajeTotal", puntaje);
}


// Función para mostrar el mensaje de fin de juego
function mostrarFinJuego() {
    const mensajeFinal = document.createElement("p");
    mensajeFinal.textContent = `¡Juego Finalizado! Tu puntaje final es: ${puntaje}`;

    // Mostrar la mejor puntuación
    const mejorPuntaje = localStorage.getItem("mejorPuntaje");
    if (!mejorPuntaje || puntaje > parseInt(mejorPuntaje)) {
        localStorage.setItem("mejorPuntaje", puntaje);
        mensajeFinal.textContent += `\n¡Nuevo récord!`;
    } else {
        mensajeFinal.textContent += `\nMejor puntuación: ${mejorPuntaje}`;
    }
    document.body.appendChild(mensajeFinal);
}



// Iniciar el juego cuando la página esté cargada
window.addEventListener('load', () => {
    inicializarPuntaje();
    iniciarJuego();
});
