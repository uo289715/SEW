<?php
// Clase Moneda
class Moneda {
    protected $monedaLocal;
    protected $monedaReferencia;

    // Constructor de la clase
    public function __construct($monedaLocal, $monedaReferencia = 'EUR') {
        $this->monedaLocal = $monedaLocal;
        $this->monedaReferencia = $monedaReferencia;
    }

    // Getter para obtener la moneda local
    public function getMonedaLocal() {
        return $this->monedaLocal;
    }

    // Setter para establecer la moneda local
    public function setMonedaLocal($monedaLocal) {
        $this->monedaLocal = $monedaLocal;
    }

    // Getter para obtener la moneda de referencia
    public function getMonedaReferencia() {
        return $this->monedaReferencia;
    }

    // Setter para establecer la moneda de referencia
    public function setMonedaReferencia($monedaReferencia) {
        $this->monedaReferencia = $monedaReferencia;
    }

     // Método para obtener el tipo de cambio
     public function obtenerTipoDeCambio() {
        // URL de la API Exchangerate API (sin necesidad de API Key)
        $url = "https://api.exchangerate-api.com/v4/latest/" . $this->monedaReferencia;
        
        // Realizamos la solicitud
        $response = file_get_contents($url);
        
        // Decodificamos la respuesta JSON
        $data = json_decode($response, true);
        
        // Verificamos si la respuesta contiene los tipos de cambio
        if (isset($data['rates'][$this->monedaLocal])) {
            return $data['rates'][$this->monedaLocal];
        } else {
            return null;  // Si no se encuentra el tipo de cambio
        }
    }
}

// Declaración de la clase Carrusel
class Carrusel {
    // Propiedades de la clase
    protected $capital;
    protected $pais;

    // Constructor de la clase
    public function __construct($capital, $pais) {
        $this->capital = $capital;
        $this->pais = $pais;
    }

    // Método para obtener la capital
    public function getCapital() {
        return $this->capital;
    }

    // Método para obtener el país
    public function getPais() {
        return $this->pais;
    }

    // Método para obtener imágenes desde Flickr con un tag del país
    public function obtenerFotosFlickr() {
        $apiKey = '796d1f5b5216ccc53342fa2cec5c8c54';
        $tag = urlencode($this->pais); // Usamos el nombre del país como tag

        $perPage = 10;  // Número de fotos a obtener
        
        // URL para la API de Flickr
        $url = 'http://api.flickr.com/services/feeds/photos_public.gne?';
        $url .= '&api_key=' . $apiKey;
        $url .= '&tags=' . $tag;
        $url .= '&per_page=' . $perPage;
        $url .= '&format=json';
        $url .= '&nojsoncallback=1';

        // Realizamos la llamada a la API de Flickr
        $response = file_get_contents($url);
        $json = json_decode($response);

        if ($json == null) {
            return json_encode(["error" => "Error al obtener fotos desde Flickr."]);
        } else {
            // Creamos un array para almacenar las URLs de las fotos
            $fotos = [];
            
            // Extraemos las imágenes y las almacenamos en el array
            for ($i = 0; $i < $perPage; $i++) {
                $foto = $json->items[$i];
                $titulo = $foto->title;
                $urlFoto = $foto->media->m;  // URL de la imagen
                $fotos[] = ['titulo' => $titulo, 'url' => $urlFoto];
            }
            
            // Pasamos las fotos al frontend a través de JSON
            return json_encode($fotos);
        }
    }
}

// Si se solicita el JSON de las fotos
if (isset($_GET['json'])) {
    // Crear una instancia de la clase Carrusel y obtener las fotos
    $carrusel = new Carrusel("Silverstone", "England");
    echo $carrusel->obtenerFotosFlickr();
    exit;  // Evitar que se procese más código (evitar mostrar HTML)
}

$moneda = new Moneda('GBP');  // Cambia 'GBP' por la moneda local que necesites
$tipoCambio = $moneda->obtenerTipoDeCambio();

// Mostrar la información del tipo de cambio
if ($tipoCambio !== null) {
    $tipoCambioHTML = "<p>El tipo de cambio de 1 EUR a {$moneda->getMonedaLocal()} es: {$tipoCambio}</p>";
} else {
    $tipoCambioHTML = "<p>No se pudo obtener el tipo de cambio.</p>";
}

?>


<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1Desktop</title>
    <meta name ="author" content ="Javier Gutierrez Esquinas" />
    <meta name ="description" content ="Viajes para ver la F1" />
    <meta name ="keywords" content ="F1,Viajes,Hotel" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/imagenes/icono.ico" type="image/x-icon">
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1><a href=index.html title="F1 Desktop">F1 Desktop</a></h1>
        <nav>
            <a href="index.html" title="inicio">Inicio</a>
            <a href="piloto.html" title="inicio">Piloto</a>
            <a href="noticias.html" title="inicio">Noticias</a>
            <a href="calendario.html" title="inicio">Calendario</a>
            <a href="meteorologia.html" title="inicio">Meteorologia</a>
            <a href="circuito.html" title="inicio">Circuito</a>
            <a href="viajes.php" class="active" title="inicio">Viajes</a>
            <a href="juegos.html" title="inicio">Juegos</a>
        </nav>
    </header>

    <p> Estás en: <a href=index.html title="Inicio"> Inicio</a> -> Viajes</p>

    <h2>Viajes</h2>
    
    <section>
        <h3>Introduccion a Viajes</h3>
        <p>¡Sigue el recorrido de la Fórmula 1 en Inglaterra! Mira nuestro carrusel de imágenes para sumergirte en el ambiente de Inglaterra</p>
    </section>


    <article>
        <h3>
            Carrusel de Imágenes
        </h3> 
        <button> &gt; </button>
        <button> &lt; </button>
    </article>

    <?php echo $tipoCambioHTML; ?>
    
    <input type="button" value="Obtener mapa estático" onClick = "miMapa.getMapaEstaticoGoogle('ubicacion');"/>
    <div></div>

    <div></div>
    
   

    <script src="js/viajes.js"></script>
</body>
</html>