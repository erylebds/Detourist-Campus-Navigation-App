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

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $user, $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        // NOTE: for now this is plain-text password, same as your SQL
        if ($pass === $row['password']) {
            // store admin info in the session
            $_SESSION['id'] = $row['admin_id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['email'] = $row['email'];

            // go to admin dashboard
            echo "<script>
                    alert('Login successful');
                    window.location.href = '../admin/dashboard.php';
                  </script>";
            exit();
        } else {
            echo "<script>
                    alert('Incorrect password');
                    window.location.href = '../login.html';
                  </script>";
            exit();
        }
    } else {
        echo "<script>
                alert('Username or email not found');
                window.location.href = '../login.html';
              </script>";
        exit();
    }
} else {
    echo "<script>
            alert('Please enter username and password');
            window.location.href = '../login.html';
          </script>";
    exit();
}

$conn->close();
?>
