<?php
session_start();

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "detourist";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
if ($conn->connect_error) {
    echo "<script>alert('Database connection failed'); window.location.href = '../login.html';</script>";
    exit();
}

if (isset($_POST['username']) && isset($_POST['password'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // -------------------
    // 1) TRY AS ADMIN
    // -------------------
    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $user, $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if ($pass === $row['password']) {
            // ADMIN LOGIN SUCCESS
            $_SESSION['role'] = 'admin';
            $_SESSION['admin_id'] = $row['admin_id'];
            $_SESSION['admin_username'] = $row['username'];
            $_SESSION['admin_email'] = $row['email'];

            echo "<script>
                    alert('Admin login successful');
                    window.location.href = '../admin/dashboard.php';
                  </script>";
            exit();
        }
        // if password doesn't match, we won't try client; we just fail
        echo "<script>alert('Incorrect password'); window.location.href = '../login.html';</script>";
        exit();
    }

    // -------------------
    // 2) IF NOT ADMIN, TRY AS CLIENT
    // -------------------
    $stmt = $conn->prepare("SELECT * FROM client WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $user, $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if ($pass === $row['password']) {
            // CLIENT LOGIN SUCCESS
            $_SESSION['role'] = 'client';
            $_SESSION['client_id'] = $row['client_id'];
            $_SESSION['client_username'] = $row['username'];
            $_SESSION['client_email'] = $row['email'];

            echo "<script>
                    alert('Client login successful');
                    // after client login, go to your client side (map page)
                    window.location.href = '../index.html';
                  </script>";
            exit();
        } else {
            echo "<script>alert('Incorrect password'); window.location.href = '../login.html';</script>";
            exit();
        }
    }

    // -------------------
    // 3) NO MATCH IN BOTH TABLES
    // -------------------
    echo "<script>alert('Username or email not found'); window.location.href = '../login.html';</script>";
    exit();

} else {
    echo "<script>alert('Please enter username and password'); window.location.href = '../login.html';</script>";
    exit();
}

$conn->close();
?>
