<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Detourist Admin Dashboard</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #fff8f0;
        }
        .admin-wrapper {
            max-width: 900px;
            margin: 80px auto;
            padding: 20px;
            background: #ffffff;
            border: 1px solid #ffd6a5;
            border-radius: 8px;
        }
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .admin-header h1 {
            color: #e67e22;
            margin: 0;
        }
        .admin-nav {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .admin-nav a {
            text-decoration: none;
            color: #162d48;
            font-weight: 500;
        }
        .admin-nav a:hover {
            text-decoration: underline;
        }
        .quick-links {
            margin-top: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
            gap: 20px;
        }
        .card {
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ffd6a5;
            background: #fffdf8;
        }
        .card h3 {
            margin-top: 0;
            color: #e67e22;
        }
        .card p {
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        .card a {
            font-size: 0.9rem;
            color: #162d48;
            font-weight: 500;
        }
        .card a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<div class="admin-wrapper">
    <div class="admin-header">
        <h1>Admin Dashboard</h1>

        <div class="admin-nav">
            <span>Admin: <strong><?php echo htmlspecialchars($_SESSION['admin_username']); ?></strong></span>
            <a href="logout.php">Logout</a>
        </div>
    </div>

    <hr><br>

    <h2>Welcome!</h2>
    <p>This is the admin landing page for <strong>Detourist</strong>.</p>

    <div class="quick-links">
    <div class="card">
        <h3>Manage Announcements</h3>
        <p>Create, edit, or delete announcements that appear on the client site.</p>
        <a href="announcements.php">Go to Announcements →</a>
    </div>

    <div class="card">
        <h3>Create Student Account</h3>
        <p>Add a new client-side user (students) who can log in to the navigation system.</p>
        <a href="create-student.php">Create Student Account →</a>
    </div>
</div>


    </div>
</div>
</body>
</html>
