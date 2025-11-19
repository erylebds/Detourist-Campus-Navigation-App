<?php
/**
 * - Connects to the database via 'connectDB.php'.
 * - Retrieves all rows from the 'announcement' table, ordered by newest first.
 * - Collects results into an array.
 * - Outputs the array as a JSON response.
 */
?>

<?php
require 'connectDB.php';

$sql = "SELECT * FROM announcement ORDER BY created_at DESC";
$result = $conn->query($sql);

$announcements = [];
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

echo json_encode($announcements);
