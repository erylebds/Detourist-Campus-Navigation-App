<?php
/*
    - Sanitizes user input to prevent SQL injection.
    - Queries room details and associated floor map.
    - Provides fallback images if no specific images exist.
    - Returns up to 10 matching rooms as a JSON response.
*/
?>

<?php
require 'connectDB.php';

$roomName = $_GET['room_code'] ?? '';
$roomName = $conn->real_escape_string($roomName);

$stmt = $conn->prepare("SELECT rl.id AS room_id, rl.name AS room_code, rl.floor_id, rl.wing, rl.room_image_path,
               mf.map_image_path AS floor_map
        FROM roomlabel rl
        LEFT JOIN mapfloor mf ON rl.floor_id = mf.floor_id
        WHERE rl.floor_id=? AND rl.name LIKE ?
        LIMIT 10");
$stmt->bind_param("is", $_GET["current_floor"], $_GET["room_code"]);
$stmt->execute();

$result = $stmt->get_result();
$rooms = [];

while ($row = $result->fetch_assoc()) {
    $row['room_image'] = !empty($row['room_image_path'])
        ? $row['room_image_path']
        // Default if the room image is not available
        : 'assets/backgrounds/maryheights-campus.jpg';

    $row['floor_map'] = !empty($row['floor_map'])
        ? $row['floor_map']
        : 'assets/floors/floor5.png';

    $rooms[] = $row;
}

echo json_encode($rooms);
