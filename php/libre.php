<?php
$servername = "localhost";
$username = "DBUSER2024";
$password = "DBPSWD2024";
$dbname = "f1_database";  // Nombre de la base de datos

// Obtener la lista de pilotos para el formulario de comparación

$conn = new mysqli($servername, $username, $password);

// Comprobar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if (!$conn->select_db($dbname)) {
    die("Error seleccionando la base de datos: " . $conn->error);
}

$sqlPilotos = "SELECT id, nombre FROM pilotos";

$resultPilotos = $conn->query($sqlPilotos);
if (!$resultPilotos) {
    die("Error al obtener la lista de pilotos: " . $conn->error);
}

// Inicializar variables para estadísticas de comparación
$statsPiloto1 = [];
$statsPiloto2 = [];

// Comparar pilotos al enviar el formulario
if (isset($_POST['comparar'])) {
    $piloto1Id = $_POST['piloto1'];
    $piloto2Id = $_POST['piloto2'];

    if ($piloto1Id && $piloto2Id) {
        // Consultar estadísticas del primer piloto
        $sqlStats1 = "
            SELECT 
                p.nombre AS piloto, 
                e.nombre AS equipo, 
                COUNT(r.id) AS carreras,
                AVG(r.posicion) AS posicion_promedio
            FROM pilotos p
            LEFT JOIN equipos e ON p.equipo_id = e.id
            LEFT JOIN resultados r ON p.id = r.piloto_id
            WHERE p.id = $piloto1Id
            GROUP BY p.id
        ";
        $resultStats1 = $conn->query($sqlStats1);
        if ($resultStats1->num_rows > 0) {
            $statsPiloto1 = $resultStats1->fetch_assoc();
        }

        // Consultar estadísticas del segundo piloto
        $sqlStats2 = "
            SELECT 
                p.nombre AS piloto, 
                e.nombre AS equipo, 
                COUNT(r.id) AS carreras,
                AVG(r.posicion) AS posicion_promedio
            FROM pilotos p
            LEFT JOIN equipos e ON p.equipo_id = e.id
            LEFT JOIN resultados r ON p.id = r.piloto_id
            WHERE p.id = $piloto2Id
            GROUP BY p.id
        ";
        $resultStats2 = $conn->query($sqlStats2);
        if ($resultStats2->num_rows > 0) {
            $statsPiloto2 = $resultStats2->fetch_assoc();
        }
    } else {
        $message = "Por favor, selecciona ambos pilotos para comparar.";
    }
}
if (isset($_POST['crear_db'])) {
    // Crear conexión
    $conn = new mysqli($servername, $username, $password);

    // Comprobar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Crear base de datos si no existe
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    if ($conn->query($sql) === TRUE) {

    } else {

    }

    
    // Seleccionar la base de datos
    $conn->select_db($dbname);

    // Borrar las tablas si ya existen antes de crear nuevas (de forma separada)
    $dropTablesSql = [
        "DROP TABLE IF EXISTS resultados",
        "DROP TABLE IF EXISTS carreras",
        "DROP TABLE IF EXISTS circuitos",
        "DROP TABLE IF EXISTS pilotos",
        "DROP TABLE IF EXISTS equipos"
    ];

    // Ejecutar las consultas DROP TABLE
    foreach ($dropTablesSql as $sql) {
        if ($conn->query($sql) === FALSE) {
            echo "Error al eliminar la tabla: " . $conn->error;
            break;
        }
    }
    // Crear las tablas
    $sql = "
        CREATE TABLE IF NOT EXISTS equipos (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pilotos (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL UNIQUE,
            equipo_id INT(11),
            FOREIGN KEY (equipo_id) REFERENCES equipos(id)
        );

        CREATE TABLE IF NOT EXISTS circuitos (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS carreras (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            circuito_id INT(11),
            fecha DATE,
            FOREIGN KEY (circuito_id) REFERENCES circuitos(id)
        );

        CREATE TABLE IF NOT EXISTS resultados (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            piloto_id INT(11),
            carrera_id INT(11),
            posicion INT(11),
            FOREIGN KEY (piloto_id) REFERENCES pilotos(id),
            FOREIGN KEY (carrera_id) REFERENCES carreras(id)
        );
    ";

    if ($conn->multi_query($sql)) {

    } else {

    }

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Cerrar la conexión
    $conn->close();
}
// Importar datos desde CSV
if (isset($_POST['importar_csv'])) {
    if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] == 0) {
        $file = $_FILES['csv_file']['tmp_name'];

        if (($handle = fopen($file, "r")) !== FALSE) {
            // Crear la conexión
            $conn = new mysqli($servername, $username, $password, $dbname);

            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }

            $lineNumber = 0;
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                // Suponemos que el CSV tiene el formato: nombre_piloto,nombre_equipo
                if ($lineNumber > 0) { // Saltar la cabecera
                    $nombrePiloto = $data[0];
                    $nombreEquipo = $data[1];

                    // Verificar si el equipo ya existe
                    $sqlEquipoExistente = "SELECT id FROM equipos WHERE nombre = '$nombreEquipo'";
                    $resultadoEquipo = $conn->query($sqlEquipoExistente);

                    if ($resultadoEquipo->num_rows > 0) {
                        // Si el equipo ya existe, obtener el ID
                        $equipo = $resultadoEquipo->fetch_assoc();
                        $equipoId = $equipo['id'];
                    } else {
                        // Si el equipo no existe, insertarlo
                        $sqlEquipo = "INSERT INTO equipos (nombre) VALUES ('$nombreEquipo')";
                        if ($conn->query($sqlEquipo) === TRUE) {
                            $equipoId = $conn->insert_id; // Obtener el ID del equipo insertado
                        } else {
                            continue;
                        }
                    }

                    // Insertar piloto con el ID del equipo
                    $sqlPiloto = "INSERT INTO pilotos (nombre, equipo_id) VALUES ('$nombrePiloto', '$equipoId')";
                    if ($conn->query($sqlPiloto) !== TRUE) {
                    }
                }
                $lineNumber++;
            }

            fclose($handle);

            $conn->close();
        } else {
        }
    } else {
    }
}
if (isset($_POST['insertar_datos_prueba'])) {
    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Comprobar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Datos de prueba para la tabla 'equipos'
    $equipos = [
        ['Mercedes'],
        ['Red Bull Racing'],
        ['Ferrari'],
        ['McLaren']
    ];

    foreach ($equipos as $equipo) {
        $sql = "INSERT INTO equipos (nombre) VALUES ('" . $equipo[0] . "')";
        $conn->query($sql);
    }

    // Datos de prueba para la tabla 'pilotos'
    $pilotos = [
        ['Lewis Hamilton', 1], // Mercedes
        ['Max Verstappen', 2], // Red Bull Racing
        ['Charles Leclerc', 3], // Ferrari
        ['Lando Norris', 4]    // McLaren
    ];

    foreach ($pilotos as $piloto) {
        // Verificar si el piloto ya existe en la base de datos
        $sqlCheck = "SELECT id FROM pilotos WHERE nombre = '" . $piloto[0] . "'";
        $resultCheck = $conn->query($sqlCheck);

        // Si el piloto no existe, insertarlo
        if ($resultCheck->num_rows == 0) {
            $sql = "INSERT INTO pilotos (nombre, equipo_id) VALUES ('" . $piloto[0] . "', " . $piloto[1] . ")";
            $conn->query($sql);
        }
    }


    // Datos de prueba para la tabla 'circuitos'
    $circuitos = [
        ['Silverstone Circuit'],
        ['Monaco Grand Prix'],
        ['Spa-Francorchamps'],
        ['Monza Circuit']
    ];

    foreach ($circuitos as $circuito) {
        $sql = "INSERT INTO circuitos (nombre) VALUES ('" . $circuito[0] . "')";
        $conn->query($sql);
    }

    // Datos de prueba para la tabla 'carreras'
    $carreras = [
        [1, '2023-07-09'], // Silverstone
        [2, '2023-05-28'], // Monaco
        [3, '2023-08-27'], // Spa
        [4, '2023-09-03']  // Monza
    ];

    foreach ($carreras as $carrera) {
        $sql = "INSERT INTO carreras (circuito_id, fecha) VALUES (" . $carrera[0] . ", '" . $carrera[1] . "')";
        $conn->query($sql);
    }

    // Datos de prueba para la tabla 'resultados'
    $resultados = [
        [1, 1, 1], // Lewis Hamilton, Silverstone, 1st place
        [2, 1, 2], // Max Verstappen, Silverstone, 2nd place
        [3, 1, 3], // Charles Leclerc, Silverstone, 3rd place
        [4, 1, 4], // Lando Norris, Silverstone, 4th place

        [2, 2, 1], // Max Verstappen, Monaco, 1st place
        [3, 2, 2], // Charles Leclerc, Monaco, 2nd place
        [4, 2, 3], // Lando Norris, Monaco, 3rd place
        [1, 2, 4], // Lewis Hamilton, Monaco, 4th place
    ];

    foreach ($resultados as $resultado) {
        $sql = "INSERT INTO resultados (piloto_id, carrera_id, posicion) VALUES (" . $resultado[0] . ", " . $resultado[1] . ", " . $resultado[2] . ")";
        $conn->query($sql);
    }
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Comprobar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Consultar pilotos solo una vez y liberar el resultado anterior si existe
    $sqlPilotos = "SELECT id, nombre FROM pilotos";
    $resultPilotos = $conn->query($sqlPilotos);

    if (!$resultPilotos) {
        die("Error al obtener la lista de pilotos: " . $conn->error);
    }

    // Liberar cualquier resultado previo para evitar problemas de sincronización
    if ($resultPilotos->num_rows > 0) {
        // Si ya hay un resultado, procedemos con el procesamiento de los datos
        $resultPilotos->data_seek(0);  // Restablecer el puntero para procesar nuevamente
    }

    $conn->close();
}

// Exportar datos a CSV
if (isset($_POST['exportar_csv'])) {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Seleccionar los datos que quieres exportar, por ejemplo, de la tabla "pilotos"
    $sql = "SELECT * FROM pilotos";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Definir la ruta de exportación dentro de php/exports/
        $exportDirectory = "exports/";

        // Verificar si la carpeta existe, si no, crearla
        if (!is_dir($exportDirectory)) {
            mkdir($exportDirectory, 0777, true);
        }

        // Definir el nombre del archivo CSV
        $filename = $exportDirectory . "pilotos_exportados_" . date("Ymd_His") . ".csv";
        
        // Abrir el archivo para escritura
        $file = fopen($filename, 'w');
        
        // Escribir la cabecera
        $header = ['ID', 'Nombre', 'Equipo ID'];
        fputcsv($file, $header);

        // Escribir las filas
        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }

        fclose($file);
    } else {
    }

    $conn->close();
}
?>


<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Juegos</title>
    <meta name ="author" content ="Javier Gutierrez Esquinas" />
    <meta name ="description" content ="Juegos" />
    <meta name ="keywords" content ="F1,Juegos" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="libre.css" />
    <link rel="icon" href="../multimedia/imagenes/icono.ico" type="image/x-icon">

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
            <a href="viajes.php" title="inicio">Viajes</a>
            <a href="juegos.html" class="active" title="inicio">Juegos</a>
        </nav>
    </header>

    <p> Estás en: <a href=index.html title="Inicio"> Inicio</a> -> Juegos -> Libre </p>

    <h2>Aplicación de Fórmula 1</h2>

    <h3>Funciones de la aplicación</h3>

    <!-- Botón para crear la base de datos y tablas -->
    <form action="" method="post">
        <button type="submit" name="crear_db">Crear Base de Datos y Tablas</button>
    </form>

    <!-- Formulario para importar datos desde un archivo CSV -->
    <form action="" method="post" enctype="multipart/form-data">
        <p>Seleccione un archivo CSV:</p>
        <input type="file" name="csv_file" accept=".csv" required>
        <button type="submit" name="importar_csv">Importar Datos desde CSV</button>
    </form>

    <!-- Formulario para exportar datos a un archivo CSV -->
    <form action="" method="post">
        <button type="submit" name="exportar_csv">Exportar Datos a CSV</button>
    </form>
    <!-- Botón para insertar datos de prueba -->
    <form action="" method="post">
        <button type="submit" name="insertar_datos_prueba">Insertar Datos de Prueba</button>
    </form>


    <!-- Formulario para seleccionar pilotos -->
    <form action="" method="post">
        <label for="piloto1">Selecciona el primer piloto:</label>
        <select name="piloto1" id="piloto1" required>
            <option value="">-- Piloto 1 --</option>
            <?php
            if ($resultPilotos->num_rows > 0) {
                while ($row = $resultPilotos->fetch_assoc()) {
                    echo "<option value='{$row['id']}'>{$row['nombre']}</option>";
                }
            }
            ?>
        </select>

        <label for="piloto2">Selecciona el segundo piloto:</label>
        <select name="piloto2" id="piloto2" required>
            <option value="">-- Piloto 2 --</option>
            <?php
            // Reiniciar el puntero del resultado para volver a listar pilotos
            $resultPilotos->data_seek(0);
            if ($resultPilotos->num_rows > 0) {
                while ($row = $resultPilotos->fetch_assoc()) {
                    echo "<option value='{$row['id']}'>{$row['nombre']}</option>";
                }
            }
            ?>
        </select>

        <button type="submit" name="comparar">Comparar</button>
    </form>

    <!-- Resultados de la comparación -->
    <?php if (!empty($statsPiloto1) && !empty($statsPiloto2)): ?>
        <h2>Comparación</h2>
        <table>
            <thead>
                <tr>
                    <th>Estadística</th>
                    <th><?php echo $statsPiloto1['piloto']; ?></th>
                    <th><?php echo $statsPiloto2['piloto']; ?></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Equipo</td>
                    <td><?php echo $statsPiloto1['equipo']; ?></td>
                    <td><?php echo $statsPiloto2['equipo']; ?></td>
                </tr>
                <tr>
                    <td>Carreras Competidas</td>
                    <td><?php echo $statsPiloto1['carreras']; ?></td>
                    <td><?php echo $statsPiloto2['carreras']; ?></td>
                </tr>
                <tr>
                    <td>Posición Promedio</td>
                    <td><?php echo number_format($statsPiloto1['posicion_promedio'], 2); ?></td>
                    <td><?php echo number_format($statsPiloto2['posicion_promedio'], 2); ?></td>
                </tr>
            </tbody>
        </table>
    <?php elseif (isset($_POST['comparar'])): ?>
        <p>No se encontraron datos para uno o ambos pilotos seleccionados.</p>
    <?php endif; ?>

</body>
</html>
