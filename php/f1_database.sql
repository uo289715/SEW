-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-12-2024 a las 17:01:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `f1_database`
--

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS f1_database;
USE f1_database;

-- --------------------------------------------------------
-- Estructura de la tabla 'equipos'
--

CREATE TABLE `equipos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de la tabla 'pilotos'
--

CREATE TABLE `pilotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL UNIQUE,
  `equipo_id` int(11),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`equipo_id`) REFERENCES `equipos`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de la tabla 'circuitos'
--

CREATE TABLE `circuitos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de la tabla 'carreras'
--

CREATE TABLE `carreras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `circuito_id` int(11),
  `fecha` date,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`circuito_id`) REFERENCES `circuitos`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de la tabla 'resultados'
--

CREATE TABLE `resultados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `piloto_id` int(11),
  `carrera_id` int(11),
  `posicion` int(11),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`piloto_id`) REFERENCES `pilotos`(`id`),
  FOREIGN KEY (`carrera_id`) REFERENCES `carreras`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
