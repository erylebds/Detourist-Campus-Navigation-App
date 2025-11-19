<?php
/*
    - Starts a session and includes the database connection.
    - Checks if username/email and password are submitted via POST.
    - Prepares a SQL statement to fetch admin data matching the username or email.
    - Verifies the provided password against the stored password.
    - On success: sets session variables (role, admin_id, username, email) and redirects to the admin dashboard.
    - On failure: shows alert messages for incorrect password, missing fields, or user not found, then redirects back to the login page.
    - Closes the database connection at the end.
*/
?>

<?php
session_start();

require 'connectDB.php';

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

