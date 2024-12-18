class Fondo {
    // Constructor que recibe el nombre del país, la capital y el circuito de F1
    constructor(pais, capital, circuitoF1) {
        this.pais = pais;               // Almacena el nombre del país
        this.capital = capital;         // Almacena el nombre de la capital
        this.circuitoF1 = circuitoF1;   // Almacena el nombre del circuito de F1
        this.obtenerImagenDeCircuito();
    }
    // Método para obtener una imagen del circuito utilizando la API de Flickr
    obtenerImagenDeCircuito() {
        var flickrAPI="https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=796d1f5b5216ccc53342fa2cec5c8c54&tags=f1%2C+silverstone%2Ccircuit&tag_mode=all&format=json&nojsoncallback=1";
        $.getJSON(flickrAPI)
            .done(function(data) {
                if (data.photos && data.photos.photo.length > 0) {
                    $.each(data.photos.photo, function(i, item) {
                        var imgSrc = `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_b.jpg`;
                        $("body").css("background-image", `url(${imgSrc})`);
                        $("body").css("background-size", "cover");
                        if (i === 0) {
                            return false;
                        }
                     });
                } else {
                    console.log("No se encontraron imágenes.");
                }
            })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud:", textStatus, errorThrown);
        });
            
    }
}