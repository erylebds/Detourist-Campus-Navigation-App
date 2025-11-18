<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "detourist";

$conn = new mysqli($servername, $username, $password, $database);

//Confirm if connection to the database was successful
if ($conn -> connect_error) {
    die ("Connection failed: " . $conn -> connect_error);
}
?>