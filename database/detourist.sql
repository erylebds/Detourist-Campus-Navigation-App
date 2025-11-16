-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 16, 2025 at 04:39 AM
-- Server version: 8.0.41
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
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
-- Table structure for table `mapfloor`
--

DROP TABLE IF EXISTS `mapfloor`;
CREATE TABLE IF NOT EXISTS `mapfloor` (
  `floor_id` int NOT NULL AUTO_INCREMENT,
  `building_code` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_number` int NOT NULL,
  `map_image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`floor_id`),
  UNIQUE KEY `building_code` (`building_code`,`floor_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mapfloor`
--

INSERT INTO `mapfloor` (`floor_id`, `building_code`, `floor_number`, `map_image_path`) VALUES
(5, 'D', 5, 'assets/images/floor5.png');

-- --------------------------------------------------------

--
-- Table structure for table `mapnode`
--

DROP TABLE IF EXISTS `mapnode`;
CREATE TABLE IF NOT EXISTS `mapnode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_label_id` int DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `x_coord` int NOT NULL,
  `y_coord` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_mapnode_roomlabel` (`room_label_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mapnode`
--

INSERT INTO `mapnode` (`id`, `room_label_id`, `type`, `x_coord`, `y_coord`) VALUES
(1, NULL, 'corridor', 119, 37),
(2, NULL, 'corridor', 119, 60),
(3, NULL, 'corridor', 119, 86),
(4, NULL, 'corridor', 119, 123),
(5, NULL, 'corridor', 119, 165),
(6, NULL, 'corridor', 119, 190),
(7, NULL, 'corridor', 119, 220),
(8, NULL, 'corridor', 119, 231),
(9, NULL, 'corridor', 119, 260),
(10, NULL, 'corridor', 119, 286),
(11, NULL, 'corridor', 119, 325),
(12, NULL, 'corridor', 119, 352),
(13, NULL, 'corridor', 154, 325),
(14, NULL, 'corridor', 209, 325),
(15, NULL, 'corridor', 247, 325),
(16, NULL, 'corridor', 283, 325),
(17, NULL, 'corridor', 317, 325),
(18, NULL, 'corridor', 361, 325),
(19, NULL, 'corridor', 389, 325),
(20, NULL, 'corridor', 446, 325),
(21, NULL, 'corridor', 475, 325),
(22, NULL, 'corridor', 520, 325),
(23, NULL, 'corridor', 554, 325),
(24, NULL, 'corridor', 590, 325),
(25, NULL, 'corridor', 628, 325),
(26, NULL, 'corridor', 683, 325),
(27, NULL, 'corridor', 715, 37),
(28, NULL, 'corridor', 715, 60),
(29, NULL, 'corridor', 715, 116),
(30, NULL, 'corridor', 715, 171),
(31, NULL, 'corridor', 715, 193),
(32, NULL, 'corridor', 715, 245),
(33, NULL, 'corridor', 715, 261),
(34, NULL, 'corridor', 715, 325),
(35, 8, 'room', 136, 37),
(36, 8, 'room', 136, 86),
(37, 7, 'room', 136, 123),
(38, 7, 'room', 136, 190),
(39, 6, 'room', 136, 220),
(40, 6, 'room', 136, 286),
(41, 5, 'room', 154, 343),
(42, 5, 'room', 209, 343),
(43, 9, 'room', 247, 343),
(44, 9, 'room', 283, 343),
(45, 10, 'room', 317, 343),
(46, 10, 'room', 361, 343),
(47, 11, 'room', 389, 343),
(48, 11, 'room', 446, 343),
(49, 12, 'room', 475, 343),
(50, 12, 'room', 520, 343),
(51, 13, 'room', 554, 343),
(52, 13, 'room', 590, 343),
(53, 14, 'room', 628, 343),
(54, 14, 'room', 683, 343),
(55, 19, 'room', 700, 37),
(56, 19, 'room', 700, 116),
(57, 18, 'room', 700, 193),
(58, 18, 'room', 700, 261),
(59, 17, 'room', 732, 27),
(60, 16, 'room', 732, 171),
(61, 16, 'room', 732, 245),
(62, 15, 'room', 732, 325),
(63, 1, 'room', 105, 27),
(64, 2, 'room', 105, 165),
(65, 2, 'room', 105, 231),
(66, 3, 'room', 105, 260),
(67, 3, 'room', 105, 325),
(68, 4, 'room', 105, 352),
(69, 20, 'room', 86, 127),
(70, 21, 'room', 750, 127),
(71, NULL, 'exit', 86, 60),
(72, NULL, 'exit', 265, 297),
(73, NULL, 'exit', 572, 297),
(74, NULL, 'exit', 750, 60),
(75, NULL, 'exit', 446, 297);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wing` tinyint NOT NULL,
  `room_number` int NOT NULL,
  `room_type` enum('classroom','office','lab','comfort_room','entrance','safe_route') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'classroom',
  `x_coord` int NOT NULL,
  `y_coord` int NOT NULL,
  `floor_id` int NOT NULL,
  `room_image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_code` (`room_code`),
  KEY `floor_id` (`floor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`room_id`, `room_code`, `building_name`, `wing`, `room_number`, `room_type`, `x_coord`, `y_coord`, `floor_id`, `room_image_path`) VALUES
(1, 'entrance', 'Devesse', 1, 0, 'entrance', 53, 60, 5, 'assets/images/entrance_stairs.jpg'),
(2, 'safe_entra', 'Devesse', 1, 0, 'safe_route', 53, 62, 5, 'assets/images/entrance_stairs.jpg'),
(3, 'fire_exitR', 'Devesse', 1, 0, 'safe_route', 70, 62, 5, 'assets/images/entrance_stairs.jpg'),
(4, 'fire_exitL', 'Devesse', 1, 0, 'safe_route', 30, 62, 5, 'assets/images/entrance_stairs.jpg'),
(5, 'safe_east', 'Devesse', 2, 0, 'safe_route', 92, 13, 5, 'assets/images/entrance_stairs.jpg'),
(6, 'safe_west', 'Devesse', 0, 0, 'safe_route', 8, 13, 5, 'assets/images/entrance_stairs.jpg'),
(7, 'D511', 'Devesse', 1, 1, 'classroom', 30, 86, 5, 'assets/images/room.jpg'),
(8, 'D512', 'Devesse', 1, 2, 'classroom', 40, 86, 5, 'assets/images/room.jpg'),
(9, 'D513', 'Devesse', 1, 3, 'classroom', 50, 86, 5, 'assets/images/room.jpg'),
(10, 'D514', 'Devesse', 1, 4, 'classroom', 59, 86, 5, 'assets/images/room.jpg'),
(11, 'D515', 'Devesse', 1, 5, 'classroom', 69, 86, 5, 'assets/images/room.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `roomlabel`
--

DROP TABLE IF EXISTS `roomlabel`;
CREATE TABLE IF NOT EXISTS `roomlabel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `x_coord` int NOT NULL,
  `y_coord` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roomlabel`
--

INSERT INTO `roomlabel` (`id`, `name`, `x_coord`, `y_coord`) VALUES
(1, 'D501', 48, 40),
(2, 'D502', 48, 210),
(3, 'D503', 48, 300),
(4, 'D504', 48, 390),
(5, 'D505', 160, 390),
(6, 'D506', 160, 250),
(7, 'D507', 160, 160),
(8, 'D508', 160, 70),
(9, 'D511', 240, 390),
(10, 'D512', 320, 390),
(11, 'D513', 400, 390),
(12, 'D514', 480, 390),
(13, 'D515', 560, 390),
(14, 'D525', 640, 390),
(15, 'D522', 755, 370),
(16, 'D524', 755, 230),
(17, 'D521', 755, 40),
(18, 'D526', 640, 230),
(19, 'D528', 640, 90),
(20, 'CR(M)', 30, 145),
(21, 'CR(F)', 765, 145);

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
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
-- Constraints for table `mapnode`
--
ALTER TABLE `mapnode`
  ADD CONSTRAINT `FK_mapnode_roomlabel` FOREIGN KEY (`room_label_id`) REFERENCES `roomlabel` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
