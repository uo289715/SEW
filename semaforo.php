<?php
// Clase Record
class Record {
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $connection;

    // Constructor
    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";

        // Crear la conexión
        $this->connection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        // Comprobar si la conexión fue exitosa
        if ($this->connection->connect_error) {
            die("Error de conexión: " . $this->connection->connect_error);
        }
    }

    // Método para guardar el registro en la base de datos
    public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
        $query = "INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)";
        $stmt = $this->connection->prepare($query);

        if (!$stmt) {
            die("Error al preparar la consulta: " . $this->connection->error);
        }

        // Vincular los parámetros
        $stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);

        // Ejecutar la consulta
        if (!$stmt->execute()) {
            die("Error al guardar el registro: " . $stmt->error);
        }

        $stmt->close();
    }

    // Método para obtener los 10 mejores resultados dentro de un rango de niveles
    public function getTop10Records($nivelMin, $nivelMax) {
        $query = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel BETWEEN ? AND ? ORDER BY tiempo ASC LIMIT 10";
        $stmt = $this->connection->prepare($query);

        if (!$stmt) {
            die("Error al preparar la consulta: " . $this->connection->error);
        }

        // Vincular los parámetros
        $stmt->bind_param("dd", $nivelMin, $nivelMax);

        // Ejecutar la consulta
        $stmt->execute();

        // Obtener los resultados
        $result = $stmt->get_result();
        $records = [];
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }

        $stmt->close();
        return $records;
    }

    // Método para cerrar la conexión
    public function closeConnection() {
        $this->connection->close();
    }
}

// Manejo de la lógica principal
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger los datos del formulario
    $nombre = $_POST["nombre"];
    $apellidos = $_POST["apellidos"];
    $nivel = (float) $_POST["nivel"];
    $tiempo = (float) $_POST["tiempo"];
    $nivelMin = $nivel - 0.1;
    $nivelMax = $nivel + 0.1;

    // Crear una instancia de la clase Record
    $record = new Record();

    // Guardar el nuevo registro
    $record->saveRecord($nombre, $apellidos, $nivel, $tiempo);

    // Obtener los 10 mejores resultados para el rango de niveles
    $top10Records = $record->getTop10Records($nivelMin, $nivelMax);

    // Cerrar la conexión
    $record->closeConnection();

    // Enviar la respuesta como JSON
    echo json_encode($top10Records);
    exit;  // Salir para evitar la salida redundante de HTML
}
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Juegos</title>
    <meta name ="author" content ="Javier Gutierrez Esquinas" />
    <meta name ="description" content ="Juego de memoria" />
    <meta name ="keywords" content ="F1,Juegos" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="multimedia/imagenes/icono.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />
    <script src="js/semaforo.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

</head>
<body>   
    <p> Estás en: <a href=index.html title="Inicio"> Inicio</a> -> Juegos -> Semaforo</p>

    <main>
        <script>
            // Crear una instancia de la clase Memoria para inicializar el juego
            document.addEventListener("DOMContentLoaded", () => {
                new Semaforo(); // Inicializa el juego después de cargar el DOM
            }); 
        </script>
    </main>
</body>
</html>