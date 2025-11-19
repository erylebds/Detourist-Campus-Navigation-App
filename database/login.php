<?php
session_start();

require 'connectDB.php';

if (isset($_POST['username']) && isset($_POST['password'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // LOGIN AS ADMIN
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
                    window.location.href = '../admin/index.php';
                  </script>";
            exit();
        } else {
            echo "<script>alert('Incorrect password'); window.location.href = '../login.html';</script>";
            exit();
        }
    }
    echo "<script>alert('Username or email not found'); window.location.href = '../login.html';</script>";
    exit();
} else {
    echo "<script>alert('Please enter username and password'); window.location.href = '../login.html';</script>";
    exit();
}

$conn->close();

