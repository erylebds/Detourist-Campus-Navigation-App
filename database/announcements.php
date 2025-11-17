<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "detourist";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$sql = "SELECT * FROM announcement ORDER BY created_at DESC";
$result = $conn->query($sql);

$announcements = [];
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

echo json_encode($announcements);
?>
