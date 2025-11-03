-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 03, 2025 at 05:33 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `detourist`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `email`, `password`) VALUES
(1, 'admin', 'admin@gmail.com', '123'),
(2, 'admin2', 'admin2@gmail.com', '123');

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
CREATE TABLE IF NOT EXISTS `announcement` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`announcement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`announcement_id`, `title`, `message`, `created_at`) VALUES
(1, 'Fire Drill', 'A fire drill will be conducted tomorrow at 10:00 AM. Please evacuate calmly.', '2025-10-11 14:00:00'),
(2, 'System Maintenance', 'The system will be down for maintenance from 2 AM to 4 AM on Sunday.', '2025-10-10 09:00:00'),
(3, 'New Lab Opening', 'The new computer lab on the 5th floor is now open for use.', '2025-10-12 07:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `guestlocation`
--

DROP TABLE IF EXISTS `guestlocation`;
CREATE TABLE IF NOT EXISTS `guestlocation` (
  `guest_id` int NOT NULL AUTO_INCREMENT,
  `x_coord` int NOT NULL,
  `y_coord` int NOT NULL,
  `floor_id` int NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_shared` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`guest_id`),
  KEY `floor_id` (`floor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `guestlocation`
--

INSERT INTO `guestlocation` (`guest_id`, `x_coord`, `y_coord`, `floor_id`, `timestamp`, `is_shared`) VALUES
(1, 120, 210, 5, '2025-10-12 08:30:00', 1),
(2, 250, 190, 5, '2025-10-12 08:45:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `mapfloor`
--

DROP TABLE IF EXISTS `mapfloor`;
CREATE TABLE IF NOT EXISTS `mapfloor` (
  `floor_id` int NOT NULL AUTO_INCREMENT,
  `building_code` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_number` int NOT NULL,
  `map_image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`floor_id`),
  UNIQUE KEY `building_code` (`building_code`,`floor_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mapfloor`
--

INSERT INTO `mapfloor` (`floor_id`, `building_code`, `floor_number`, `map_image_path`) VALUES
(5, 'D', 5, 'floor5.png');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wing` tinyint NOT NULL,
  `room_number` int NOT NULL,
  `room_type` enum('classroom','office','lab','comfort_room','entrance','safe_route') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'classroom',
  `x_coord` int NOT NULL,
  `y_coord` int NOT NULL,
  `floor_id` int NOT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_code` (`room_code`),
  KEY `floor_id` (`floor_id`)
) ;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`room_id`, `room_code`, `building_name`, `wing`, `room_number`, `room_type`, `x_coord`, `y_coord`, `floor_id`) VALUES
(1, 'D5EE', 'Devesse', 1, 0, 'entrance', 53, 60, 5),
(2, 'D5ER0', 'Devesse', 1, 0, 'safe_route', 53, 62, 5),
(3, 'D5ER1', 'Devesse', 1, 0, 'safe_route', 70, 62, 5),
(4, 'D5ER2', 'Devesse', 1, 0, 'safe_route', 30, 62, 5),
(5, 'D5ER3', 'Devesse', 2, 0, 'safe_route', 92, 13, 5),
(6, 'D5ER4', 'Devesse', 0, 0, 'safe_route', 8, 13, 5),
(7, 'D511', 'Devesse', 1, 1, 'classroom', 30, 86, 5),
(8, 'D512', 'Devesse', 1, 2, 'classroom', 40, 86, 5),
(9, 'D513', 'Devesse', 1, 3, 'classroom', 50, 86, 5),
(10, 'D514', 'Devesse', 1, 4, 'classroom', 59, 86, 5),
(11, 'D515', 'Devesse', 1, 5, 'classroom', 69, 86, 5);

-- --------------------------------------------------------

--
-- Table structure for table `roomstatus`
--

DROP TABLE IF EXISTS `roomstatus`;
CREATE TABLE IF NOT EXISTS `roomstatus` (
  `room_id` int NOT NULL,
  `is_occupied` tinyint(1) DEFAULT '0',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roomstatus`
--

INSERT INTO `roomstatus` (`room_id`, `is_occupied`, `updated_at`) VALUES
(1, 1, '2025-10-12 08:25:00');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
CREATE TABLE IF NOT EXISTS `route` (
  `route_id` int NOT NULL AUTO_INCREMENT,
  `from_room_id` int NOT NULL,
  `to_room_id` int NOT NULL,
  `distance` float NOT NULL,
  `route_type_id` int NOT NULL,
  PRIMARY KEY (`route_id`),
  KEY `from_room_id` (`from_room_id`),
  KEY `to_room_id` (`to_room_id`),
  KEY `route_type_id` (`route_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `routetype`
--

DROP TABLE IF EXISTS `routetype`;
CREATE TABLE IF NOT EXISTS `routetype` (
  `route_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`route_type_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routetype`
--

INSERT INTO `routetype` (`route_type_id`, `name`) VALUES
(2, 'emergency'),
(1, 'normal');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `guestlocation`
--
ALTER TABLE `guestlocation`
  ADD CONSTRAINT `guestlocation_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `mapfloor` (`floor_id`) ON DELETE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `mapfloor` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `roomstatus`
--
ALTER TABLE `roomstatus`
  ADD CONSTRAINT `roomstatus_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE;

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `route_ibfk_1` FOREIGN KEY (`from_room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `route_ibfk_2` FOREIGN KEY (`to_room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `route_ibfk_3` FOREIGN KEY (`route_type_id`) REFERENCES `routetype` (`route_type_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
