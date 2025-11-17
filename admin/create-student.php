<?php
session_start();

// Only admins can access this page
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.html");
    exit();
}

require '../database/connectDB.php';

$success = "";
$error   = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Basic validation
    if ($username === '' || $email === '' || $password === '') {
        $error = "All fields are required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } else {

        // Insert into existing `client` table
        $stmt = $conn->prepare(
            "INSERT INTO client (username, email, password)
             VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $username, $email, $password);

        if ($stmt->execute()) {
            $success = "Client account created successfully!";
        } else {
            // 1062 = duplicate key (violates UNIQUE username/email)
            if ($stmt->errno === 1062) {
                $error = "Username or email already exists. Please use another.";
            } else {
                $error = "Database error: " . $stmt->error;
            }
        }

        $stmt->close();
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create Client Account</title>
    <link rel="stylesheet" href="../css/style.css">

    <style>
        body { font-family: 'Poppins', sans-serif; background: #fff8f0; }
        .wrapper {
            max-width: 500px;
            margin: 80px auto;
            background: #ffffff;
            padding: 25px;
            border: 1px solid #ffd6a5;
            border-radius: 8px;
        }
        .logout { text-align: right; margin-bottom: 10px; }
        .logout a { color: #162d48; font-weight: 500; text-decoration: none; }
        h1 { color: #e67e22; margin-bottom: 20px; }
        label { display: block; font-weight: 500; margin-top: 10px; }
        input[type="text"],
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border-radius: 6px;
            border: 1px solid #ccc;
        }
        button {
            margin-top: 15px;
            padding: 10px 14px;
            border-radius: 6px;
            background: #e67e22;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 500;
        }
        .msg { padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem; }
        .success { background: #d4edda; color: #155724; }
        .error   { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
<div class="wrapper">

    <div class="logout">
        <a href="logout.php">Logout</a>
    </div>

    <h1>Create Client Account</h1>

    <?php if ($success): ?>
        <div class="msg success"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="msg error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST" action="">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" required>

        <label for="email">Email</label>
        <input id="email" name="email" type="email" required>

        <label for="password">Password</label>
        <input id="password" name="password" type="password" required>

        <button type="submit">Create Account</button>
    </form>
</div>
</body>
</html>
