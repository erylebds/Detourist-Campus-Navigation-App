<?php
session_start();

// protect this page: only admins can access
if (!isset($_SESSION['id'])) {
    header("Location: ../login.html");
    exit();
}

require '../database/connectDB.php';

// ---------- HANDLE FORM ACTIONS ----------

// Add new announcement
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $title = trim($_POST['title'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $id = $_POST['id'] ?? null;

    if ($_POST['action'] === 'add') {
        if ($title !== '' && $message !== '') {
            $stmt = $conn->prepare("INSERT INTO announcement (title, message) VALUES (?, ?)");
            $stmt->bind_param("ss", $title, $message);
            $stmt->execute();
            $stmt->close();
        }
    }

    if ($_POST['action'] === 'update' && !empty($id)) {
        if ($title !== '' && $message !== '') {
            $stmt = $conn->prepare("UPDATE announcement SET title = ?, message = ? WHERE announcement_id = ?");
            $stmt->bind_param("ssi", $title, $message, $id);
            $stmt->execute();
            $stmt->close();
        }
    }

    // after add/update, avoid resubmission on refresh
    header("Location: announcements.php");
    exit();
}

// Delete announcement (GET with ?delete=ID)
if (isset($_GET['delete'])) {
    $deleteId = (int) $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM announcement WHERE announcement_id = ?");
    $stmt->bind_param("i", $deleteId);
    $stmt->execute();
    $stmt->close();

    header("Location: announcements.php");
    exit();
}

// ---------- LOAD ANNOUNCEMENTS ----------
$result = $conn->query("SELECT * FROM announcement ORDER BY created_at DESC");
$announcements = [];
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}
$conn->close();

// for editing: when ?edit=ID is present, prefill the form
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
    <title>Manage Announcements - Detourist Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #fff8f0;
        }
        .admin-wrapper {
            max-width: 1000px;
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
        .admin-nav a {
            margin-left: 15px;
            text-decoration: none;
            color: #162d48;
            font-weight: 500;
        }
        .admin-nav a:hover {
            text-decoration: underline;
        }
        .form-card {
            margin: 20px 0;
            padding: 15px;
            background: #fffdf8;
            border: 1px solid #ffd6a5;
            border-radius: 8px;
        }
        .form-card h2 {
            margin-top: 0;
            color: #e67e22;
        }
        .form-group {
            margin-bottom: 10px;
        }
        .form-group label {
            display:block;
            font-weight: 500;
            margin-bottom: 4px;
        }
        .form-group input[type="text"],
        .form-group textarea {
            width: 100%;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-family: inherit;
        }
        .btn {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .btn-primary {
            background: #e67e22;
            color: #fff;
        }
        .btn-secondary {
            background: #fff;
            color: #e67e22;
            border: 1px solid #e67e22;
        }
        .btn-danger {
            background: #e74c3c;
            color: #fff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 10px;
            border-bottom: 1px solid #ffd6a5;
            vertical-align: top;
        }
        th {
            background: #fffdf8;
            text-align: left;
        }
        .actions a {
            margin-right: 8px;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
<div class="admin-wrapper">
    <div class="admin-header">
        <h1>Manage Announcements</h1>
        <div class="admin-nav">
            <span>Admin: <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong></span>
            <a href="dashboard.php">Dashboard</a>
            <a href="../index.html" target="_blank">View Client Site</a>
            <a href="logout.php">Logout</a>
        </div>
    </div>

    <!-- Add / Edit Form -->
    <div class="form-card">
        <?php if ($editAnnouncement): ?>
            <h2>Edit Announcement</h2>
        <?php else: ?>
            <h2>Add New Announcement</h2>
        <?php endif; ?>

        <form method="POST" action="announcements.php">
            <input type="hidden" name="action" value="<?php echo $editAnnouncement ? 'update' : 'add'; ?>">
            <?php if ($editAnnouncement): ?>
                <input type="hidden" name="id" value="<?php echo (int)$editAnnouncement['announcement_id']; ?>">
            <?php endif; ?>

            <div class="form-group">
                <label for="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value="<?php echo $editAnnouncement ? htmlspecialchars($editAnnouncement['title']) : ''; ?>"
                >
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                ><?php echo $editAnnouncement ? htmlspecialchars($editAnnouncement['message']) : ''; ?></textarea>
            </div>

            <button type="submit" class="btn btn-primary">
                <?php echo $editAnnouncement ? 'Update Announcement' : 'Add Announcement'; ?>
            </button>
            <?php if ($editAnnouncement): ?>
                <a href="announcements.php" class="btn btn-secondary">Cancel Edit</a>
            <?php endif; ?>
        </form>
    </div>

    <!-- List of Announcements -->
    <h2>Existing Announcements</h2>
    <?php if (count($announcements) === 0): ?>
        <p>No announcements yet.</p>
    <?php else: ?>
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
                    <td><?php echo htmlspecialchars($a['title']); ?></td>
                    <td><?php echo nl2br(htmlspecialchars($a['message'])); ?></td>
                    <td><?php echo htmlspecialchars($a['created_at']); ?></td>
                    <td class="actions">
                        <a href="announcements.php?edit=<?php echo (int)$a['announcement_id']; ?>">Edit</a>
                        <a href="announcements.php?delete=<?php echo (int)$a['announcement_id']; ?>"
                           onclick="return confirm('Delete this announcement?');"
                           style="color:#e74c3c;">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>
</body>
</html>
