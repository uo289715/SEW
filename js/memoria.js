"use strict";
class Memoria {
    constructor() {
        this.hasFlippedCard = false; 
        this.lockBoard = false;      
        this.firstCard = null;       
        this.secondCard = null;      
        this.pairsMatched = 0; // Nueva variable para contar los pares emparejados

        this.elements = [
            { element: "RedBull", source: "multimedia/imagenes/Red_Bull_Racing_logo.svg" },
            { element: "McLaren", source: "multimedia/imagenes/McLaren_Racing_logo.svg" },
            { element: "Alpine", source: "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg" },
            { element: "AstonMartin", source: "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg" },
            { element: "Ferrari", source: "multimedia/imagenes/Scuderia_Ferrari_Logo.svg" },
            { element: "Mercedes", source: "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg" },
            { element: "RedBull", source: "multimedia/imagenes/Red_Bull_Racing_logo.svg" },
            { element: "McLaren", source: "multimedia/imagenes/McLaren_Racing_logo.svg" },
            { element: "Alpine", source: "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg" },
            { element: "AstonMartin", source: "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg" },
            { element: "Ferrari", source: "multimedia/imagenes/Scuderia_Ferrari_Logo.svg" },
            { element: "Mercedes", source: "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg" }
        ];

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    getElements() {
        return this.elements;
    }

    shuffleElements() {
        // Algoritmo de Durstenfeld para barajar
        for (let i = this.elements.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true; // Bloquear el tablero
        let seccion = document.querySelector("section"); // Cambia esto según la forma en que selecciones la sección

        // Aplica el estilo para bloquear la interacción
        seccion.style.pointerEvents = "none";
        setTimeout(() => {
            // Aquí se voltea las cartas
            this.firstCard.removeAttribute('data-state'); // Voltear
            this.secondCard.removeAttribute('data-state'); // Voltear

            // Muestra el encabezado de nuevo
            const firstHeader = this.firstCard.querySelector('h3');
            const secondHeader = this.secondCard.querySelector('h3');
 
            firstHeader.style.display = 'block'; // Mostrar encabezado
            secondHeader.style.display = 'block'; // Mostrar encabezado

            firstHeader.style.textAlign = 'center';
            secondHeader.style.textAlign = 'center';

            // Asegurarse que los encabezados estén centrados correctamente
            firstHeader.style.display = 'flex';
            firstHeader.style.alignItems = 'center';
            firstHeader.style.justifyContent = 'center';

            secondHeader.style.display = 'flex';
            secondHeader.style.alignItems = 'center';
            secondHeader.style.justifyContent = 'center';
            this.resetBoard(); // Resetear el tablero
        }, 2000); 
    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
        let seccion = document.querySelector("section"); // Cambia esto según la forma en que selecciones la sección

        // Aplica el estilo para bloquear la interacción
        seccion.style.pointerEvents = "auto";
    }

    checkForMatch() {
        var isMatch = this.firstCard.dataset.element === this.secondCard.dataset.element;
        isMatch ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        // Deshabilitar las cartas que forman parte de la pareja
        this.firstCard.datastate = 'revealed';
        this.secondCard.datastate = 'revealed';
        this.resetBoard();
        this.pairsMatched++; // Aumentar el contador de pares emparejados
        this.checkGameOver(); // Comprobar si el juego ha terminado
    }

    checkGameOver() {
        if (this.pairsMatched === this.elements.length / 2) {
            this.showGameOver();
        }
    }

    showGameOver() {
        // Crear el contenedor para el mensaje de finalización del juego
        const message = document.createElement('section');
        message.innerHTML = `
            <p>¡Juego Finalizado! ¡Felicidades, has encontrado todas las parejas!</p>
            <button onclick="location.reload();">Reiniciar el juego</button>
        `;
        
        // Seleccionar el <aside> para insertar el mensaje justo debajo de él
        const aside = document.querySelector('aside');
        
        // Insertar el mensaje debajo del <aside>
        aside.insertAdjacentElement('afterend', message);
    }
    

    // Método para crear los elementos del juego
    createElements() {
        this.elements.forEach(element => {
            const article = document.createElement('article'); // Crear el nodo article
            article.setAttribute('data-element', element.element); // Atributo data-element

            // Encabezado de orden 3
            const header = document.createElement('h3');
            header.innerText = 'Tarjeta de memoria';
            article.appendChild(header); // Añadir el encabezado al article

            // Imagen
            const img = document.createElement('img');
            img.src = element.source; // Ruta de la imagen
            img.alt = element.element; // Texto alternativo
            img.style.display = 'none'; // Ocultar imagen inicialmente
            article.appendChild(img); // Añadir la imagen al article

            // Añadir el evento de clic
            article.addEventListener('click', () => {
                img.style.display = 'block'; // Mostrar la imagen al hacer clic
                header.style.display = 'none'; // Ocultar el encabezado
            });

            // Añadir el article al tablero de juego
            document.querySelector("section").appendChild(article);
        });
    }

    addEventListeners() {
        const cards = document.querySelectorAll("article"); // Seleccionar todos los artículos

        cards.forEach(card => {
            card.addEventListener("click", this.flipCard.bind(card, this)); // Asociar el evento clic
        });
    }

    flipCard(game) {
        // Verifica si la tarjeta ya está revelada
        if (this.dataset.state === 'revealed') return;

        // Verifica si el tablero está bloqueado
        if (game.lockBoard) return;

        // Verifica si la tarjeta es la misma que la primera seleccionada
        if (this === game.firstCard) return;

        // Cambia el estado de la tarjeta a 'flip'
        this.dataset.state = 'flip';

        // Si no hay tarjeta previamente volteada
        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = this; // Asigna esta tarjeta como la primera
        } else {
            game.secondCard = this; // Asigna esta tarjeta como la segunda
            game.checkForMatch(); // Comprueba si hay coincidencia
        }
    }
}
