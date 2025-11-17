<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "detourist";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$roomName = $_GET['room_code'] ?? '';
$roomName = $conn->real_escape_string($roomName);

//Fetch rooms based on name in roomlabel table
$sql = "SELECT rl.id AS room_id, rl.name AS room_code, rl.floor_id, rl.wing, rl.room_image_path,
               mf.map_image_path AS floor_map
        FROM roomlabel rl
        LEFT JOIN mapfloor mf ON rl.floor_id = mf.floor_id
        WHERE rl.name LIKE '$roomName%'
        LIMIT 10";

$result = $conn->query($sql);
$rooms = [];

//Set default images if missing
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