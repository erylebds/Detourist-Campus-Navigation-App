CREATE DATABASE  IF NOT EXISTS `detourist` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `detourist`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: detourist
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','admin@gmail.com','123'),(2,'admin2','admin2@gmail.com','123');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guestlocation`
--

DROP TABLE IF EXISTS `guestlocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guestlocation` (
  `guest_id` int NOT NULL AUTO_INCREMENT,
  `x_coord` int NOT NULL,
  `y_coord` int NOT NULL,
  `floor_id` int NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_shared` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`guest_id`),
  KEY `floor_id` (`floor_id`),
  CONSTRAINT `guestlocation_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `mapfloor` (`floor_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guestlocation`
--

LOCK TABLES `guestlocation` WRITE;
/*!40000 ALTER TABLE `guestlocation` DISABLE KEYS */;
INSERT INTO `guestlocation` VALUES (1,120,210,5,'2025-10-12 08:30:00',1),(2,250,190,5,'2025-10-12 08:45:00',0),(3,180,170,2,'2025-10-12 09:00:00',1),(4,300,250,3,'2025-10-12 09:15:00',1);
/*!40000 ALTER TABLE `guestlocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mapfloor`
--

DROP TABLE IF EXISTS `mapfloor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mapfloor` (
  `floor_id` int NOT NULL AUTO_INCREMENT,
  `building_code` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_number` int NOT NULL,
  `map_image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`floor_id`),
  UNIQUE KEY `building_code` (`building_code`,`floor_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mapfloor`
--

LOCK TABLES `mapfloor` WRITE;
/*!40000 ALTER TABLE `mapfloor` DISABLE KEYS */;
INSERT INTO `mapfloor` VALUES (1,'D',1,'floor1.png'),(2,'D',2,'floor2.png'),(3,'D',3,'floor3.png'),(5,'D',5,'floor5.png');
/*!40000 ALTER TABLE `mapfloor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'Fire Drill','A fire drill will be conducted tomorrow at 10:00 AM. Please evacuate calmly.','2025-10-11 14:00:00'),(2,'System Maintenance','The system will be down for maintenance from 2 AM to 4 AM on Sunday.','2025-10-10 09:00:00'),(3,'New Lab Opening','The new computer lab on the 5th floor is now open for use.','2025-10-12 07:00:00');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wing` tinyint NOT NULL,
  `room_number` int NOT NULL,
  `room_type` enum('classroom','office','lab','comfort_room','exit','safe_zone','other') COLLATE utf8mb4_unicode_ci DEFAULT 'classroom',
  `x_coord` int NOT NULL,
  `y_coord` int NOT NULL,
  `floor_id` int NOT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_code` (`room_code`),
  KEY `floor_id` (`floor_id`),
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `mapfloor` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `room_chk_1` CHECK ((`wing` in (0,1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'D503','Devesse',0,3,'classroom',100,200,5),(2,'D515','Devesse',1,5,'classroom',200,200,5),(3,'D524','Devesse',2,4,'lab',300,250,5),(4,'D528','Devesse',2,8,'lab',150,180,5);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roomstatus`
--

DROP TABLE IF EXISTS `roomstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roomstatus` (
  `room_id` int NOT NULL,
  `is_occupied` tinyint(1) DEFAULT '0',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`),
  CONSTRAINT `roomstatus_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roomstatus`
--

LOCK TABLES `roomstatus` WRITE;
/*!40000 ALTER TABLE `roomstatus` DISABLE KEYS */;
INSERT INTO `roomstatus` VALUES (1,1,'2025-10-12 08:25:00'),(2,0,'2025-10-12 08:30:00'),(3,1,'2025-10-12 08:40:00'),(4,0,'2025-10-12 08:50:00');
/*!40000 ALTER TABLE `roomstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route` (
  `route_id` int NOT NULL AUTO_INCREMENT,
  `from_room_id` int NOT NULL,
  `to_room_id` int NOT NULL,
  `distance` float NOT NULL,
  `route_type_id` int NOT NULL,
  PRIMARY KEY (`route_id`),
  KEY `from_room_id` (`from_room_id`),
  KEY `to_room_id` (`to_room_id`),
  KEY `route_type_id` (`route_type_id`),
  CONSTRAINT `route_ibfk_1` FOREIGN KEY (`from_room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `route_ibfk_2` FOREIGN KEY (`to_room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `route_ibfk_3` FOREIGN KEY (`route_type_id`) REFERENCES `routetype` (`route_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES (1,1,2,15.5,1),(2,2,3,25,2),(3,3,4,30,1),(4,1,4,50,2);
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routetype`
--

DROP TABLE IF EXISTS `routetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routetype` (
  `route_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`route_type_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routetype`
--

LOCK TABLES `routetype` WRITE;
/*!40000 ALTER TABLE `routetype` DISABLE KEYS */;
INSERT INTO `routetype` VALUES (2,'emergency'),(1,'normal');
/*!40000 ALTER TABLE `routetype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-12 17:21:34
