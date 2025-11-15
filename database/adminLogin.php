<?php
session_start();

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "detourist";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
if ($conn->connect_error) {
    die("<script>alert('Database connection failed');</script>");
}

if (isset($_POST['username']) && isset($_POST['password'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $user, $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if ($pass === $row['password']) {
            $_SESSION['id'] = $row['admin_id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['email'] = $row['email'];

            echo "<script>alert('Login successful');</script>";
        } else {
            echo "<script>alert('Incorrect password');</script>";
        }
    } else {
        echo "<script>alert('Username or email not found');</script>";
    }

} else {
    echo "<script>alert('Please enter username and password');</script>";
}

$conn->close();
?>