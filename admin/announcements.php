<?php
session_start();

// only admins can access
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.html");
    exit();
}

require '../database/connectDB.php';

// ---------- HANDLE FORM ACTIONS ----------

// helper: normalize HTML datetime-local to MySQL DATETIME
function normalizeDateTime($value) {
    $value = trim($value ?? '');
    if ($value === '') {
        return date('Y-m-d H:i:s');   // now()
    }
    // datetime-local comes as "YYYY-MM-DDTHH:MM"
    $value = str_replace('T', ' ', $value) . ':00'; // add seconds
    return $value;
}

// ADD / UPDATE
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $title   = trim($_POST['title']   ?? '');
    $message = trim($_POST['message'] ?? '');
    $date    = normalizeDateTime($_POST['created_at'] ?? '');
    $id      = $_POST['id'] ?? null;

    if ($_POST['action'] === 'add') {
        // INSERT -> directly creates a new row in detourist.announcement
        if ($title !== '' && $message !== '') {
            $stmt = $conn->prepare(
                "INSERT INTO announcement (title, message, created_at)
                 VALUES (?, ?, ?)"
            );
            $stmt->bind_param("sss", $title, $message, $date);
            $stmt->execute();
            $stmt->close();
        }
    }

    if ($_POST['action'] === 'update' && !empty($id)) {
        // UPDATE -> directly modifies the existing row
        if ($title !== '' && $message !== '') {
            $stmt = $conn->prepare(
                "UPDATE announcement
                 SET title = ?, message = ?, created_at = ?
                 WHERE announcement_id = ?"
            );
            $stmt->bind_param("sssi", $title, $message, $date, $id);
            $stmt->execute();
            $stmt->close();
        }
    }

    header("Location: announcements.php");
    exit();
}

// DELETE
if (isset($_GET['delete'])) {
    $deleteId = (int) $_GET['delete'];

    // DELETE -> removes row from detourist.announcement
    $stmt = $conn->prepare(
        "DELETE FROM announcement WHERE announcement_id = ?"
    );
    $stmt->bind_param("i", $deleteId);
    $stmt->execute();
    $stmt->close();

    header("Location: announcements.php");
    exit();
}

// ---------- LOAD DATA FOR DISPLAY ----------
$result = $conn->query(
    "SELECT * FROM announcement ORDER BY created_at DESC"
);
$announcements = [];
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}
$conn->close();

// for edit mode
$editAnnouncement = null;
if (isset($_GET['edit'])) {
    $editId = (int) $_GET['edit'];
    foreach ($announcements as $a) {
        if ((int)$a['announcement_id'] === $editId) {
            $editAnnouncement = $a;
            break;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manage Announcements - Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #fff8f0;
        }
        .admin-wrapper {
            max-width: 1000px;
            margin: 80px auto;
            background: #ffffff;
            border: 1px solid #ffd6a5;
            border-radius: 8px;
            padding: 25px;
        }
        .topbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 15px;
        }
        .topbar a {
            text-decoration: none;
            font-weight: 500;
            color: #162d48;
        }
        h1 {
            color: #e67e22;
        }
        .form-card {
            padding: 20px;
            background: #fffdf8;
            border: 1px solid #ffd6a5;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        .form-card label {
            display: block;
            margin-top: 10px;
            font-weight: 500;
        }
        .form-card input[type="text"],
        .form-card input[type="datetime-local"],
        .form-card textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            margin-top: 5px;
            font-family: inherit;
            background: white;
        }
        textarea {
            resize: none;
            height: 120px;
        }
        .btn {
            padding: 8px 16px;
            margin-top: 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-primary {
            background: #e67e22;
            color: white;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        td, th {
            padding: 10px;
            border-bottom: 1px solid #ffd6a5;
        }
        th {
            background: #fffdf8;
        }
        .actions a {
            margin-right: 12px;
            font-size: 0.9rem;
        }
        .delete {
            color: #e74c3c;
        }
    </style>
</head>
<body>

<div class="admin-wrapper">

    <div class="topbar">
        <a href="logout.php">Logout</a>
    </div>

    <h1>Manage Announcements</h1>

    <div class="form-card">
        <h2><?= $editAnnouncement ? "Edit Announcement" : "Add New Announcement" ?></h2>

        <form method="POST" action="announcements.php">
            <input type="hidden" name="action" value="<?= $editAnnouncement ? 'update' : 'add' ?>">
            <?php if ($editAnnouncement): ?>
                <input type="hidden" name="id" value="<?= (int)$editAnnouncement['announcement_id'] ?>">
            <?php endif; ?>

            <label>Title</label>
            <input type="text" name="title" required value="<?= $editAnnouncement ? htmlspecialchars($editAnnouncement['title']) : '' ?>">

            <label>Message</label>
            <textarea name="message" required><?= $editAnnouncement ? htmlspecialchars($editAnnouncement['message']) : '' ?></textarea>

            <label>Date & Time</label>
            <input type="datetime-local" name="created_at"
                   value="<?= $editAnnouncement ? date('Y-m-d\TH:i', strtotime($editAnnouncement['created_at'])) : date('Y-m-d\TH:i') ?>">

            <button class="btn btn-primary" type="submit">
                <?= $editAnnouncement ? "Update Announcement" : "Add Announcement" ?>
            </button>
        </form>
    </div>

    <h2>Existing Announcements</h2>

    <table>
        <thead>
        <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <?php foreach ($announcements as $a): ?>
            <tr>
                <td><?= htmlspecialchars($a['title']) ?></td>
                <td><?= nl2br(htmlspecialchars($a['message'])) ?></td>
                <td><?= date("Y-m-d H:i", strtotime($a['created_at'])) ?></td>

                <td class="actions">
                    <a href="?edit=<?= $a['announcement_id'] ?>">Edit</a>
                    <a class="delete"
                       onclick="return confirm('Delete this announcement?');"
                       href="?delete=<?= $a['announcement_id'] ?>">Delete</a>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>

</div>
</body>
</html>
