<?php
include 'connectDB.php';

$floor_id = isset($_GET['floor_id']) ? intval($_GET['floor_id']) : 5;

$sql = "SELECT room_code, room_type, x_coord, y_coord 
        FROM room 
        WHERE floor_id = $floor_id AND room_type = 'safe_route'";

$result = $conn->query($sql);

$rooms = [];
while ($row = $result->fetch_assoc()) {
    $rooms[] = $row;
}

echo json_encode($rooms);
$conn->close();
?>