<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "detourist";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$roomCode = $_GET['room_code'] ?? '';
$roomCode = $conn->real_escape_string($roomCode);

//Fetch rooms based on room code (this query is connected to the map floor table)
$sql = "SELECT r.room_id, r.room_code, r.floor_id, r.wing, r.room_image_path,
               m.map_image_path AS floor_map
        FROM room r
        LEFT JOIN mapfloor m ON r.floor_id = m.floor_id
        WHERE r.room_code LIKE '$roomCode%'
        LIMIT 10";

$result = $conn->query($sql);
$rooms = [];

//Show these images by default if the website was just opened or if there is an error with the image path of a room
while ($row = $result->fetch_assoc()) {
    $row['room_image'] = !empty($row['room_image_path']) 
                         ? $row['room_image_path'] 
                         : 'assets/images/room.jpg';
    
    $row['floor_map'] = !empty($row['floor_map']) 
                        ? $row['floor_map'] 
                        : 'assets/images/floor5.png';

    $rooms[] = $row;
}

echo json_encode($rooms);
?>