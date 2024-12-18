class Noticias{

    constructor(){

        // Crear un mensaje dinámico para informar si el navegador soporta la API File
        const mensajeCompatibilidad = document.createElement("p");
        const body = document.querySelector("body");

        if (window.File && window.FileReader && window.FileList && window.Blob) {
        mensajeCompatibilidad.textContent = "Este navegador soporta el API File.";
        } else {
        mensajeCompatibilidad.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
        }

    // Agregar el párrafo al cuerpo del documento
        body.appendChild(mensajeCompatibilidad);
        const inputArchivo = document.getElementById("archivoTexto");
        if (inputArchivo) {
            inputArchivo.addEventListener("change", (event) => this.readInputFile(event.target.files));
        }
        const form = document.querySelector("form");
        if (form) {
            form.addEventListener("submit", (event) => {
                event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
                this.addNoticia();
            });
        }
    }

    readInputFile(files) {
        const archivo = files[0];
        const articuloPrincipal =document.createElement("article");
        const body = document.querySelector("body");
      
        // Leer contenido del archivo
        const lector = new FileReader();
        lector.onload = function (evento) {
          const contenido = evento.target.result;
      
          // Limpiar contenido previo
          articuloPrincipal.innerHTML = "";
      
          // Procesar cada línea del archivo
          const lineas = contenido.split("\n");
          lineas.forEach((linea, index) => {
            const [titular, entradilla, autor] = linea.split("_");
      
            if (titular && entradilla && autor) {
              // Crear un nuevo artículo para la noticia
              const articuloNoticia = document.createElement("article");
      
              // Crear y añadir elementos
              const encabezado = document.createElement("header");
              const titulo = document.createElement("h2");
              titulo.textContent = `${index + 1}. ${titular}`;
              encabezado.appendChild(titulo);
      
              const cuerpo = document.createElement("p");
              cuerpo.textContent = entradilla;
      
              const pie = document.createElement("footer");
              pie.innerHTML = `<em>Autor: ${autor}</em>`;
      
              // Añadir los elementos al artículo de la noticia
              articuloNoticia.appendChild(encabezado);
              articuloNoticia.appendChild(cuerpo);
              articuloNoticia.appendChild(pie);
      
              // Añadir el artículo al artículo principal
              articuloPrincipal.appendChild(articuloNoticia);
            }
          });
        };
        body.appendChild(articuloPrincipal);
        lector.readAsText(archivo);
    }

    addNoticia(){
        // Obtener los valores del formulario
    const titulo = document.querySelector("input[placeholder='Título de la noticia']").value;
    const entradilla = document.querySelector("input[placeholder='Entradilla de la noticia']").value;
    const autor = document.querySelector("input[placeholder='Autor de la noticia']").value;

    if (titulo && entradilla && autor) {
      // Crear el artículo principal si no existe
      let articuloPrincipal = document.querySelector("article");
      if (!articuloPrincipal) {
        articuloPrincipal = document.createElement("article");
        document.body.appendChild(articuloPrincipal);
      }

      // Crear un nuevo artículo para la noticia
      const articuloNoticia = document.createElement("article");

      // Crear y añadir los elementos
      const encabezado = document.createElement("header");
      const tituloElemento = document.createElement("h2");
      tituloElemento.textContent = `${articuloPrincipal.children.length + 1}. ${titulo}`;
      encabezado.appendChild(tituloElemento);

      const cuerpo = document.createElement("p");
      cuerpo.textContent = entradilla;

      const pie = document.createElement("footer");
      pie.innerHTML = `<em>Autor: ${autor}</em>`;

      // Añadir los elementos al artículo de la noticia
      articuloNoticia.appendChild(encabezado);
      articuloNoticia.appendChild(cuerpo);
      articuloNoticia.appendChild(pie);

      // Añadir el nuevo artículo al artículo principal
      articuloPrincipal.appendChild(articuloNoticia);

      // Limpiar los campos del formulario
      document.querySelector("input[placeholder='Título de la noticia']").value = "";
      document.querySelector("input[placeholder='Entradilla de la noticia']").value = "";
      document.querySelector("input[placeholder='Autor de la noticia']").value = "";
    } else {
      alert("Por favor, completa todos los campos.");
    }
  }
    
}
document.addEventListener("DOMContentLoaded", () => {
    new Noticias();
});