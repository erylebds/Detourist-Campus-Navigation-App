-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 05, 2025 at 06:47 PM
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
  `old_passwords` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `email`, `password`, `old_passwords`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$lVJX1Di/R1LsVRLOclhyqexF2Y4EloNMMf/r2HpGMndM6h9XduxU2', NULL),
(2, 'admin2', 'admin2@gmail.com', '$2b$10$N54JbSkEcNOcnlKcQAGOxOT9LIjnBA2EiQOKRrQ4YDlNJ1Sg/LdG2', NULL);

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
(3, 'New Lab Constructed', 'The new computer lab on the 5th floor is now open for use.', '2025-10-12 07:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `mapedge`
--

DROP TABLE IF EXISTS `mapedge`;
CREATE TABLE IF NOT EXISTS `mapedge` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adjacent_node_id` int NOT NULL,
  `map_node_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_mapedge_mapnode_1` (`adjacent_node_id`),
  KEY `FK_mapedge_mapnode_2` (`map_node_id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mapedge`
--

INSERT INTO `mapedge` (`id`, `adjacent_node_id`, `map_node_id`) VALUES
(1, 63, 1),
(3, 35, 1),
(4, 2, 1),
(5, 71, 2),
(6, 3, 2),
(7, 36, 3),
(8, 4, 3),
(9, 69, 4),
(10, 37, 4),
(11, 5, 4),
(12, 64, 5),
(13, 6, 5),
(14, 38, 6),
(15, 7, 6),
(16, 39, 7),
(17, 8, 7),
(18, 65, 8),
(19, 9, 8),
(20, 66, 9),
(21, 10, 9),
(22, 40, 10),
(23, 11, 10),
(24, 67, 11),
(25, 12, 11),
(26, 13, 11),
(27, 68, 12),
(28, 41, 13),
(29, 14, 13),
(30, 42, 14),
(31, 15, 14),
(32, 43, 15),
(33, 72, 15),
(34, 16, 15),
(35, 72, 16),
(36, 44, 16),
(37, 17, 16),
(38, 45, 17),
(39, 18, 17),
(40, 46, 18),
(41, 19, 18),
(42, 47, 19),
(43, 20, 19),
(44, 75, 20),
(45, 48, 20),
(46, 21, 20),
(47, 49, 21),
(48, 22, 21),
(49, 50, 22),
(50, 23, 22),
(51, 73, 23),
(52, 51, 23),
(53, 24, 23),
(54, 73, 24),
(55, 52, 24),
(56, 25, 24),
(57, 53, 25),
(58, 26, 25),
(59, 54, 26),
(60, 34, 26),
(61, 62, 34),
(62, 33, 34),
(63, 58, 33),
(64, 32, 33),
(65, 61, 32),
(66, 31, 32),
(67, 57, 31),
(68, 30, 31),
(69, 60, 30),
(70, 29, 30),
(71, 56, 29),
(72, 70, 29),
(73, 28, 29),
(74, 74, 28),
(75, 27, 28),
(76, 59, 27),
(77, 55, 27),
(78, 69, 71),
(79, 70, 74),
(80, 76, 108),
(81, 84, 108),
(82, 109, 108),
(83, 110, 109),
(84, 85, 110),
(85, 111, 110),
(86, 77, 111),
(87, 86, 111),
(88, 112, 111),
(89, 78, 112),
(90, 113, 112),
(91, 87, 113),
(92, 114, 113),
(93, 88, 114),
(94, 115, 114),
(95, 79, 115),
(96, 116, 115),
(97, 80, 116),
(98, 117, 116),
(99, 89, 117),
(100, 118, 117),
(101, 81, 118),
(102, 119, 118),
(103, 121, 118),
(104, 82, 119),
(105, 120, 119),
(106, 83, 120),
(107, 143, 120),
(108, 90, 121),
(109, 122, 121),
(110, 91, 122),
(111, 123, 122),
(112, 126, 123),
(113, 144, 126),
(114, 127, 126),
(115, 128, 127),
(116, 98, 128),
(117, 129, 128),
(118, 99, 129),
(119, 140, 129),
(120, 105, 140),
(121, 141, 140),
(122, 106, 141),
(123, 142, 141),
(124, 107, 142),
(125, 145, 142),
(126, 139, 140),
(127, 97, 139),
(128, 138, 139),
(129, 104, 138),
(130, 137, 138),
(131, 103, 137),
(132, 136, 137),
(133, 96, 136),
(134, 135, 136),
(135, 95, 135),
(136, 134, 135),
(137, 102, 134),
(138, 133, 134),
(139, 94, 133),
(140, 101, 133),
(141, 132, 133),
(142, 93, 132),
(143, 131, 132),
(144, 130, 131),
(145, 92, 130),
(146, 100, 130);

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mapfloor`
--

INSERT INTO `mapfloor` (`floor_id`, `building_code`, `floor_number`, `map_image_path`) VALUES
(4, 'D', 4, 'admin/public/assets/floors/floor4.png'),
(5, 'D', 5, 'admin/public/assets/floors/floor5.png'),
(6, 'D', 6, 'admin/public/assets/floors/floor6.png');

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
  `floor_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_mapnode_roomlabel` (`room_label_id`),
  KEY `FK_mapnode_mapfloor` (`floor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mapnode`
--

INSERT INTO `mapnode` (`id`, `room_label_id`, `type`, `x_coord`, `y_coord`, `floor_id`) VALUES
(1, NULL, 'corridor', 119, 37, 5),
(2, NULL, 'corridor', 119, 60, 5),
(3, NULL, 'corridor', 119, 86, 5),
(4, NULL, 'corridor', 119, 123, 5),
(5, NULL, 'corridor', 119, 165, 5),
(6, NULL, 'corridor', 119, 190, 5),
(7, NULL, 'corridor', 119, 220, 5),
(8, NULL, 'corridor', 119, 231, 5),
(9, NULL, 'corridor', 119, 260, 5),
(10, NULL, 'corridor', 119, 286, 5),
(11, NULL, 'corridor', 119, 325, 5),
(12, NULL, 'corridor', 119, 352, 5),
(13, NULL, 'corridor', 154, 325, 5),
(14, NULL, 'corridor', 209, 325, 5),
(15, NULL, 'corridor', 247, 325, 5),
(16, NULL, 'corridor', 283, 325, 5),
(17, NULL, 'corridor', 317, 325, 5),
(18, NULL, 'corridor', 361, 325, 5),
(19, NULL, 'corridor', 389, 325, 5),
(20, NULL, 'corridor', 446, 325, 5),
(21, NULL, 'corridor', 475, 325, 5),
(22, NULL, 'corridor', 520, 325, 5),
(23, NULL, 'corridor', 554, 325, 5),
(24, NULL, 'corridor', 590, 325, 5),
(25, NULL, 'corridor', 628, 325, 5),
(26, NULL, 'corridor', 683, 325, 5),
(27, NULL, 'corridor', 715, 37, 5),
(28, NULL, 'corridor', 715, 60, 5),
(29, NULL, 'corridor', 715, 116, 5),
(30, NULL, 'corridor', 715, 171, 5),
(31, NULL, 'corridor', 715, 193, 5),
(32, NULL, 'corridor', 715, 245, 5),
(33, NULL, 'corridor', 715, 261, 5),
(34, NULL, 'corridor', 715, 325, 5),
(35, 8, 'room', 136, 37, 5),
(36, 8, 'room', 136, 86, 5),
(37, 7, 'room', 136, 123, 5),
(38, 7, 'room', 136, 190, 5),
(39, 6, 'room', 136, 220, 5),
(40, 6, 'room', 136, 286, 5),
(41, 5, 'room', 154, 343, 5),
(42, 5, 'room', 209, 343, 5),
(43, 9, 'room', 247, 343, 5),
(44, 9, 'room', 283, 343, 5),
(45, 10, 'room', 317, 343, 5),
(46, 10, 'room', 361, 343, 5),
(47, 11, 'room', 389, 343, 5),
(48, 11, 'room', 446, 343, 5),
(49, 12, 'room', 475, 343, 5),
(50, 12, 'room', 520, 343, 5),
(51, 13, 'room', 554, 343, 5),
(52, 13, 'room', 590, 343, 5),
(53, 14, 'room', 628, 343, 5),
(54, 14, 'room', 683, 343, 5),
(55, 19, 'room', 700, 37, 5),
(56, 19, 'room', 700, 116, 5),
(57, 18, 'room', 700, 193, 5),
(58, 18, 'room', 700, 261, 5),
(59, 17, 'room', 732, 27, 5),
(60, 16, 'room', 732, 171, 5),
(61, 16, 'room', 732, 245, 5),
(62, 15, 'room', 732, 325, 5),
(63, 1, 'room', 105, 27, 5),
(64, 2, 'room', 105, 165, 5),
(65, 2, 'room', 105, 231, 5),
(66, 3, 'room', 105, 260, 5),
(67, 3, 'room', 105, 325, 5),
(68, 4, 'room', 105, 352, 5),
(69, 20, 'room', 86, 127, 5),
(70, 21, 'room', 750, 127, 5),
(71, NULL, 'exit', 86, 60, 5),
(72, NULL, 'exit', 265, 297, 5),
(73, NULL, 'exit', 572, 297, 5),
(74, NULL, 'exit', 750, 60, 5),
(75, NULL, 'exit', 446, 297, 5),
(76, 22, 'room', 105, 27, 6),
(77, 23, 'room', 86, 127, 6),
(78, 24, 'room', 105, 165, 6),
(79, 24, 'room', 105, 231, 6),
(80, 25, 'room', 105, 260, 6),
(81, 25, 'room', 105, 325, 6),
(82, 26, 'room', 105, 352, 6),
(83, 26, 'room', 105, 418, 6),
(84, 27, 'room', 136, 37, 6),
(85, 27, 'room', 136, 86, 6),
(86, 28, 'room', 136, 123, 6),
(87, 28, 'room', 136, 190, 6),
(88, 29, 'room', 136, 220, 6),
(89, 29, 'room', 136, 286, 6),
(90, 30, 'other', 154, 343, 6),
(91, 30, 'other', 209, 343, 6),
(92, 31, 'room', 700, 37, 6),
(93, 31, 'room', 700, 86, 6),
(94, 32, 'room', 700, 123, 6),
(95, 32, 'room', 700, 190, 6),
(96, 33, 'room', 700, 220, 6),
(97, 33, 'room', 700, 286, 6),
(98, 34, 'room', 628, 343, 6),
(99, 34, 'room', 683, 343, 6),
(100, 35, 'room', 732, 27, 6),
(101, 36, 'room', 750, 127, 6),
(102, 37, 'room', 732, 165, 6),
(103, 37, 'room', 732, 231, 6),
(104, 38, 'room', 732, 260, 6),
(105, 38, 'room', 732, 325, 6),
(106, 39, 'room', 732, 352, 6),
(107, 39, 'room', 732, 418, 6),
(108, NULL, 'corridor', 119, 37, 6),
(109, NULL, 'corridor', 119, 60, 6),
(110, NULL, 'corridor', 119, 86, 6),
(111, NULL, 'corridor', 119, 123, 6),
(112, NULL, 'corridor', 119, 165, 6),
(113, NULL, 'corridor', 119, 190, 6),
(114, NULL, 'corridor', 119, 220, 6),
(115, NULL, 'corridor', 119, 231, 6),
(116, NULL, 'corridor', 119, 260, 6),
(117, NULL, 'corridor', 119, 286, 6),
(118, NULL, 'corridor', 119, 325, 6),
(119, NULL, 'corridor', 119, 352, 6),
(120, NULL, 'corridor', 119, 418, 6),
(121, NULL, 'corridor', 154, 325, 6),
(122, NULL, 'corridor', 209, 325, 6),
(123, NULL, 'corridor', 247, 325, 6),
(126, NULL, 'corridor', 417, 325, 6),
(127, NULL, 'corridor', 590, 325, 6),
(128, NULL, 'corridor', 628, 325, 6),
(129, NULL, 'corridor', 683, 325, 6),
(130, NULL, 'corridor', 715, 37, 6),
(131, NULL, 'corridor', 715, 60, 6),
(132, NULL, 'corridor', 715, 86, 6),
(133, NULL, 'corridor', 715, 123, 6),
(134, NULL, 'corridor', 715, 165, 6),
(135, NULL, 'corridor', 715, 190, 6),
(136, NULL, 'corridor', 715, 220, 6),
(137, NULL, 'corridor', 715, 231, 6),
(138, NULL, 'corridor', 715, 260, 6),
(139, NULL, 'corridor', 715, 286, 6),
(140, NULL, 'corridor', 715, 325, 6),
(141, NULL, 'corridor', 715, 352, 6),
(142, NULL, 'corridor', 715, 418, 6),
(143, NULL, 'exit', 119, 433, 6),
(144, NULL, 'exit', 418, 433, 6),
(145, NULL, 'exit', 715, 433, 6);

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
  `building_name` varchar(100) NOT NULL DEFAULT 'Devesse',
  `wing` tinyint DEFAULT NULL,
  `floor_id` int DEFAULT NULL,
  `room_type` enum('classroom','office','lab','comfort_room','entrance','safe_route','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'classroom',
  `room_image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'admin/public/assets/backgrounds/maryheights-campus.jpg',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roomlabel`
--

INSERT INTO `roomlabel` (`id`, `name`, `x_coord`, `y_coord`, `building_name`, `wing`, `floor_id`, `room_type`, `room_image_path`) VALUES
(1, 'D501', 48, 40, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D501.jpg'),
(2, 'D502', 48, 210, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D502.jpg'),
(3, 'D503', 48, 300, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D503.jpg'),
(4, 'D504', 48, 390, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D504.jpg'),
(5, 'D505', 160, 390, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D505.jpg'),
(6, 'D506', 160, 250, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D506.jpg'),
(7, 'D507', 160, 160, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D507.jpg'),
(8, 'D508', 160, 70, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/D508.jpg'),
(9, 'D511', 240, 390, 'Devesse', 1, 5, 'classroom', 'admin/public/assets/rooms/D511.jpg'),
(10, 'D512', 320, 390, 'Devesse', 1, 5, 'classroom', 'admin/public/assets/rooms/D512.jpg'),
(11, 'D513', 400, 390, 'Devesse', 1, 5, 'classroom', 'admin/public/assets/rooms/D513.jpg'),
(12, 'D514', 480, 390, 'Devesse', 1, 5, 'classroom', 'admin/public/assets/rooms/D514.jpg'),
(13, 'D515', 560, 390, 'Devesse', 1, 5, 'classroom', 'admin/public/assets/rooms/D515.jpg'),
(14, 'D525', 640, 390, 'Devesse', 2, 5, 'classroom', 'admin/public/assets/rooms/D525.jpg'),
(15, 'D522', 755, 370, 'Devesse', 2, 5, 'classroom', 'admin/public/assets/rooms/D522.jpg'),
(16, 'D524', 755, 230, 'Devesse', 2, 5, 'classroom', 'admin/public/assets/rooms/D524.jpg'),
(17, 'D521', 755, 40, 'Devesse', 2, 5, 'classroom', 'admin/public/assets/rooms/D521.jpg'),
(18, 'D526', 640, 230, 'Devesse', 2, 5, 'classroom', 'admin/public/assets/rooms/D526.jpg'),
(19, 'D528', 640, 90, 'Devesse', 2, 5, 'classroom', 'admin/public/assets/rooms/D528.jpg'),
(20, 'CR(M)', 30, 145, 'Devesse', 0, 5, 'classroom', 'admin/public/assets/rooms/CR(M).jpg'),
(21, 'CR(F)', 765, 145, 'Devesse', 2, 5, 'classroom', 'admin/public/assets/rooms/CR(F).jpg'),
(22, 'D601', 48, 40, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(23, 'CR(F)', 30, 145, 'Devesse', 0, 6, 'comfort_room', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(24, 'D602', 48, 210, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(25, 'D603', 48, 300, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(26, 'D604', 48, 390, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(27, 'D608', 160, 70, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(28, 'D607', 160, 160, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(29, 'D606', 160, 250, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(30, 'Water is Life', 160, 390, 'Devesse', 0, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(31, 'D628', 640, 70, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(32, 'D627', 640, 160, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(33, 'D626', 640, 250, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(34, 'D625', 640, 390, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(35, 'D621', 755, 40, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(36, 'CR(M)', 765, 145, 'Devesse', 2, 6, 'comfort_room', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(37, 'D622', 755, 210, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(38, 'D623', 755, 300, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(39, 'D624', 755, 390, 'Devesse', 2, 6, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(40, 'D401', 48, 40, 'Devesse', 0, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(41, 'CR(F)', 30, 145, 'Devesse', 0, 4, 'comfort_room', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(42, 'D402', 48, 210, 'Devesse', 0, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(43, 'D403', 48, 300, 'Devesse', 0, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(44, 'D406', 160, 70, 'Devesse', 0, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(45, 'D405', 160, 160, 'Devesse', 0, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(46, 'D404', 160, 250, 'Devesse', 0, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(47, 'ACCG', 297, 405, 'Devesse', 1, 4, 'other', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(48, 'Book Store', 342, 360, 'Devesse', 1, 4, 'other', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(49, 'D412', 400, 390, 'Devesse', 1, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(50, 'D413', 480, 390, 'Devesse', 1, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(51, 'D414', 560, 390, 'Devesse', 1, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(52, 'D425', 640, 390, 'Devesse', 1, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(53, 'D428', 640, 70, 'Devesse', 2, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(54, 'D427', 640, 160, 'Devesse', 2, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(55, 'D426', 640, 250, 'Devesse', 2, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(56, 'D421', 755, 40, 'Devesse', 2, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(57, 'CR(M)', 765, 145, 'Devesse', 2, 4, 'comfort_room', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(58, 'D422', 755, 210, 'Devesse', 2, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(59, 'D423', 755, 300, 'Devesse', 2, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg'),
(60, 'D424', 755, 390, 'Devesse', 2, 4, 'classroom', 'admin/public/assets/backgrounds/maryheights-campus.jpg');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mapedge`
--
ALTER TABLE `mapedge`
  ADD CONSTRAINT `FK_mapedge_mapnode_1` FOREIGN KEY (`adjacent_node_id`) REFERENCES `mapnode` (`id`),
  ADD CONSTRAINT `FK_mapedge_mapnode_2` FOREIGN KEY (`map_node_id`) REFERENCES `mapnode` (`id`);

--
-- Constraints for table `mapnode`
--
ALTER TABLE `mapnode`
  ADD CONSTRAINT `FK_mapnode_mapfloor` FOREIGN KEY (`floor_id`) REFERENCES `mapfloor` (`floor_id`),
  ADD CONSTRAINT `FK_mapnode_roomlabel` FOREIGN KEY (`room_label_id`) REFERENCES `roomlabel` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
