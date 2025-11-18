<?php
session_start();

require 'connectDB.php';

if (isset($_POST['username']) && isset($_POST['password'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // 1) TRY LOGIN AS ADMIN
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
                    window.location.href = '../admin/index.php';
                  </script>";
            exit();
        } else {
            echo "<script>alert('Incorrect password'); window.location.href = '../login.html';</script>";
            exit();
        }
    }

    // // 2) NOT ADMIN, TRY LOGIN AS CLIENT
    // $stmt = $conn->prepare("SELECT * FROM client WHERE username = ? OR email = ?");
    // $stmt->bind_param("ss", $user, $user);
    // $stmt->execute();
    // $result = $stmt->get_result();

    // if ($result->num_rows === 1) {
    //     $row = $result->fetch_assoc();

    //     if ($pass === $row['password']) {
    //         // CLIENT LOGIN SUCCESS
    //         $_SESSION['role'] = 'client';
    //         $_SESSION['client_id'] = $row['client_id'];
    //         $_SESSION['client_username'] = $row['username'];
    //         $_SESSION['client_email'] = $row['email'];

    //         echo "<script>
    //                 alert('Client login successful');
    //                 window.location.href = '../index.html';
    //               </script>";
    //         exit();
    //     } else {
    //         echo "<script>alert('Incorrect password'); window.location.href = '../login.html';</script>";
    //         exit();
    //     }
    // }

    // 3) NOT FOUND IN EITHER TABLE
    echo "<script>alert('Username or email not found'); window.location.href = '../login.html';</script>";
    exit();
} else {
    echo "<script>alert('Please enter username and password'); window.location.href = '../login.html';</script>";
    exit();
}

$conn->close();
