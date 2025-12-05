<?php
/*
   - This PHP script fetches all records from the "roomlabel" table in the database.
   - It uses the database connection from 'connectDB.php', executes a SELECT query,
   - stores the results in an array, outputs the array as JSON, and closes the connection.
*/

require 'connectDB.php';
$stmt = $conn->prepare("SELECT * FROM roomlabel WHERE floor_id=?");
$stmt->bind_param("s", $_GET["current_floor"]);
$stmt->execute();

$result = $stmt->get_result();

$roomLabels = [];
while ($row = $result->fetch_assoc()) {
   $roomLabels[] = $row;
}
echo json_encode($roomLabels);
$conn->close();
