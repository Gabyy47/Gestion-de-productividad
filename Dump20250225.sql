-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: l4test
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `id_bitacora` int NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `tabla_afectada` varchar(50) NOT NULL,
  `tipo_operacion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_bitacora`),
  KEY `idx_id_bitacora` (`id_bitacora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacora`
--

LOCK TABLES `bitacora` WRITE;
/*!40000 ALTER TABLE `bitacora` DISABLE KEYS */;
/*!40000 ALTER TABLE `bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL,
  `apellido` varchar(70) NOT NULL,
  `telefono` decimal(10,2) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `estado` varchar(10) DEFAULT NULL,
  `fecha_contratacion` date NOT NULL DEFAULT '2024-01-01',
  PRIMARY KEY (`id_empleado`),
  KEY `indx_id_empleado` (`id_empleado`),
  KEY `indx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (2123,'Dayanna','Andino',98450056.00,'empleada',9000.00,'activa','2024-01-01'),(2124,'mohame','Artica',3272723.00,'admi',12000.00,'activa','2024-02-23');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maquinaria`
--

DROP TABLE IF EXISTS `maquinaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maquinaria` (
  `id_maquinaria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `id_proveedor` int NOT NULL,
  `fecha_adquisicion` date NOT NULL,
  `estado` enum('Operativa','Mantenimiento','Fuera de servicio') NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_maquinaria`),
  KEY `idx_id_maquinaria` (`id_maquinaria`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_estado` (`estado`),
  KEY `idx_proveedor` (`id_proveedor`),
  CONSTRAINT `maquinaria_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maquinaria`
--

LOCK TABLES `maquinaria` WRITE;
/*!40000 ALTER TABLE `maquinaria` DISABLE KEYS */;
/*!40000 ALTER TABLE `maquinaria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `unidad_medida` varchar(50) NOT NULL,
  `proveedor` varchar(100) DEFAULT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `cantidad_stock` int DEFAULT NULL,
  `fecha_ultima_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `descripcion` text,
  PRIMARY KEY (`id_producto`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_id_producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `contacto` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `direccion` text NOT NULL,
  `pais` varchar(50) NOT NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_id_proveedor` (`id_proveedor`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_pais` (`pais`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_productos`
--

DROP TABLE IF EXISTS `tipo_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_productos` (
  `id_tipo_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`id_tipo_producto`),
  KEY `idx_id_tipo_produto` (`id_tipo_producto`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_productos`
--

LOCK TABLES `tipo_productos` WRITE;
/*!40000 ALTER TABLE `tipo_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL,
  `apellido` varchar(70) NOT NULL,
  `nombre_usuario` varchar(70) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contraseña` varchar(150) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `indx_id_usuario` (`id_usuario`),
  KEY `indx_nombre_usuario` (`nombre_usuario`),
  KEY `indx_correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (123,'Alejandra','Artica','AleArt','artsosaalejandra@gmail.com','56789'),(125,'carmen','ochoa','Car_ochoa','carochoa@gmail.com','1243'),(127,'marcia','sosa','Mar_Sosa','mar_sosa@gmil.com','2323'),(128,'gabi','banegas','G_banegas','G_banegas@gmail.com','b12345');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'l4test'
--

--
-- Dumping routines for database 'l4test'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-25 21:33:06
