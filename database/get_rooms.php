<?php
include 'connectDB.php'; //get database

//search table if floor_id exists if not set the value as 5 by default
$floor_id = isset($_GET['floor_id']) ? intval($_GET['floor_id']) : 5; //gets all the rooms in that floor

//select data from the table
$sql = "SELECT room_code, room_type, x_coord, y_coord FROM room WHERE floor_id = $floor_id";
$result = $conn -> query($sql); //send query to the database and store the result in $result

//create an empty array of rooms
$rooms = [];
while ($row = $result -> fetch_assoc()) {
    $rooms[] = $row;
}

echo json_encode($rooms); //convert rooms array to JSON format and sends it to the browser
$conn -> close();
?>