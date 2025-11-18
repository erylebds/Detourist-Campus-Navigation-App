<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.html");
    exit();
}

require '../database/connectDB.php';

function normalizeDateTime($value) {
    $value = trim($value ?? '');
    if ($value === '') {
        return date('Y-m-d H:i:s');
    }
    // from datetime-local: 2025-11-18T04:16
    $value = str_replace('T', ' ', $value) . ':00';
    return $value;
}

$adminId = (int)$_SESSION['admin_id'];
$annMsg = '';
$accMsg  = '';
$accError = '';

// --- HANDLE POST ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['form_type'])) {

    // ANNOUNCEMENTS (add / edit)
    if ($_POST['form_type'] === 'announcement') {
        $title   = trim($_POST['title'] ?? '');
        $message = trim($_POST['message'] ?? '');
        $date    = normalizeDateTime($_POST['created_at'] ?? '');
        $annId   = isset($_POST['announcement_id']) ? (int)$_POST['announcement_id'] : 0;

        if ($title === '' || $message === '') {
            $annMsg = 'Title and message are required.';
        } else {
            if ($annId > 0) {
                $stmt = $conn->prepare(
                    "UPDATE announcement
                     SET title = ?, message = ?, created_at = ?
                     WHERE announcement_id = ?"
                );
                $stmt->bind_param("sssi", $title, $message, $date, $annId);
                $stmt->execute();
                $stmt->close();
                $annMsg = 'Announcement updated successfully.';
            } else {
                $stmt = $conn->prepare(
                    "INSERT INTO announcement (title, message, created_at)
                     VALUES (?, ?, ?)"
                );
                $stmt->bind_param("sss", $title, $message, $date);
                $stmt->execute();
                $stmt->close();
                $annMsg = 'Announcement added successfully.';
            }
        }

        header("Location: index.php?tab=announcements");
        exit();
    }

    // CHANGE PASSWORD
    if ($_POST['form_type'] === 'password') {
        $enterUsername = trim($_POST['cp_username'] ?? '');
        $oldPass       = trim($_POST['old_password'] ?? '');
        $newPass       = trim($_POST['new_password'] ?? '');
        $newPass2      = trim($_POST['new_password2'] ?? '');

        if ($enterUsername === '' || $oldPass === '' || $newPass === '' || $newPass2 === '') {
            $accError = 'All fields are required.';
        } elseif ($newPass !== $newPass2) {
            $accError = 'New passwords do not match.';
        } else {
            $stmt = $conn->prepare("SELECT username, password FROM admin WHERE admin_id = ?");
            $stmt->bind_param("i", $adminId);
            $stmt->execute();
            $res = $stmt->get_result();
            $row = $res->fetch_assoc();
            $stmt->close();

            if (!$row || $enterUsername !== $row['username']) {
                $accError = 'Incorrect username.';
            } elseif ($oldPass !== $row['password']) {
                $accError = 'Old password is incorrect.';
            } else {
                $stmt = $conn->prepare("UPDATE admin SET password = ? WHERE admin_id = ?");
                $stmt->bind_param("si", $newPass, $adminId);
                $stmt->execute();
                $stmt->close();
                $accMsg = 'Password updated successfully.';
            }
        }

        $_SESSION['acc_error'] = $accError;
        $_SESSION['acc_msg']   = $accMsg;
        header("Location: index.php?tab=account");
        exit();
    }

    // CHANGE USERNAME
    if ($_POST['form_type'] === 'username') {
        $oldUsername = trim($_POST['old_username'] ?? '');
        $newUsername = trim($_POST['new_username'] ?? '');
        $password    = trim($_POST['cu_password'] ?? '');

        if ($oldUsername === '' || $newUsername === '' || $password === '') {
            $accError = 'All fields are required.';
        } else {
            // current admin
            $stmt = $conn->prepare("SELECT username, password FROM admin WHERE admin_id = ?");
            $stmt->bind_param("i", $adminId);
            $stmt->execute();
            $res = $stmt->get_result();
            $row = $res->fetch_assoc();
            $stmt->close();

            if (!$row || $oldUsername !== $row['username']) {
                $accError = 'Old username is incorrect.';
            } elseif ($password !== $row['password']) {
                $accError = 'Password is incorrect.';
            } else {
                // ensure new username not taken
                $stmt = $conn->prepare("SELECT admin_id FROM admin WHERE username = ? AND admin_id <> ?");
                $stmt->bind_param("si", $newUsername, $adminId);
                $stmt->execute();
                $checkRes = $stmt->get_result();
                $stmt->close();

                if ($checkRes->num_rows > 0) {
                    $accError = 'That username is already taken.';
                } else {
                    $stmt = $conn->prepare("UPDATE admin SET username = ? WHERE admin_id = ?");
                    $stmt->bind_param("si", $newUsername, $adminId);
                    $stmt->execute();
                    $stmt->close();
                    $_SESSION['admin_username'] = $newUsername;
                    $accMsg = 'Username updated successfully.';
                }
            }
        }

        $_SESSION['acc_error'] = $accError;
        $_SESSION['acc_msg']   = $accMsg;
        header("Location: index.php?tab=account");
        exit();
    }
}

// DELETE announcement
if (isset($_GET['delete'])) {
    $delId = (int)$_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM announcement WHERE announcement_id = ?");
    $stmt->bind_param("i", $delId);
    $stmt->execute();
    $stmt->close();
    header("Location: index.php?tab=announcements");
    exit();
}

// LOAD announcements
$announcements = [];
$result = $conn->query("SELECT * FROM announcement ORDER BY created_at DESC");
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

// for editing a specific announcement
$editAnnouncement = null;
if (isset($_GET['edit'])) {
    $editId = (int)$_GET['edit'];
    foreach ($announcements as $a) {
        if ((int)$a['announcement_id'] === $editId) {
            $editAnnouncement = $a;
            break;
        }
    }
}

// CURRENT ADMIN INFO
$stmt = $conn->prepare("SELECT username, email FROM admin WHERE admin_id = ?");
$stmt->bind_param("i", $adminId);
$stmt->execute();
$adminRes = $stmt->get_result();
$currentAdmin = $adminRes->fetch_assoc();
$stmt->close();

if (isset($_SESSION['acc_error'])) {
    $accError = $_SESSION['acc_error'];
    unset($_SESSION['acc_error']);
}
if (isset($_SESSION['acc_msg'])) {
    $accMsg = $_SESSION['acc_msg'];
    unset($_SESSION['acc_msg']);
}

$activeTab = $_GET['tab'] ?? 'announcements';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Detourist Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #fff8f0;
        }
        .admin-layout {
            display: flex;
            min-height: 100vh;
        }
        .admin-sidebar {
            width: 260px;               /* wider sidebar */
            background-color: #162d48;
            color: #f8f8ff;
            padding: 24px 20px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        .admin-logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .admin-logo img {
            width: 150px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .admin-logo h2 {
            font-size: 1.3rem;
            margin: 0;
        }
        .admin-logo p {
            font-size: 0.9rem;
            margin: 0;
            opacity: 0.8;
        }

        .admin-nav {
            margin-top: 10px;
            flex: 1;
        }
        .admin-nav button {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            margin-bottom: 8px;
            border-radius: 6px;
            border: none;
            background: transparent;
            color: #f8f8ff;
            font-size: 0.95rem;        /* bigger, more readable */
            cursor: pointer;
            text-align: left;
        }
        .admin-nav button span.icon {
            font-size: 1.1rem;
        }
        .admin-nav button.active {
            background-color: #ff9f43;
            color: #162d48;
            font-weight: 600;
        }

        .admin-sidebar .logout-link {
            margin-top: 10px;
            font-size: 0.95rem;
        }
        .admin-sidebar .logout-link a {
            color: #ffb27a;
        }

        .admin-main {
            flex: 1;
            padding: 25px 40px;
        }
        .admin-topbar {
            display: flex;
            justify-content: flex-end;
            font-size: 0.95rem;
            margin-bottom: 10px;
        }
        .admin-topbar strong {
            color: #e67e22;
        }

        .admin-tab {
            display: none;
        }
        .admin-tab.active {
            display: block;
        }

        h1.section-title {
            color: #e67e22;
            font-size: 1.8rem;
            margin-bottom: 15px;
        }

        .card-box {
            background: #ffffff;
            border: 1px solid #ffd6a5;
            border-radius: 8px;
            padding: 18px 20px;
            margin-bottom: 25px;
        }
        .card-box h2 {
            margin-top: 0;
            font-size: 1.2rem;
        }
        label {
            font-size: 0.95rem;
        }
        input[type="text"],
        input[type="datetime-local"],
        input[type="password"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 10px;
            font-size: 0.95rem;
            border-radius: 6px;
            border: 1px solid #ccc;
            margin-top: 4px;
            margin-bottom: 10px;
            font-family: inherit;
        }
        textarea {
            resize: none;
            height: 150px;
        }
        .btn-primary {
            background: #e67e22;
            color: #fff;
            border: none;
            padding: 8px 18px;
            border-radius: 6px;
            font-size: 0.95rem;
            cursor: pointer;
        }
        .btn-secondary {
            background: #f0f0f0;
            border: 1px solid #ccc;
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        table.admin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        table.admin-table th,
        table.admin-table td {
            border-bottom: 1px solid #ffd6a5;
            padding: 8px 10px;
        }
        table.admin-table th {
            background: #fffdf8;
            text-align: left;
        }
        .msg-success {
            margin-bottom: 10px;
            padding: 8px 10px;
            border-radius: 6px;
            background: #d4edda;
            color: #155724;
            font-size: 0.9rem;
        }
        .msg-error {
            margin-bottom: 10px;
            padding: 8px 10px;
            border-radius: 6px;
            background: #f8d7da;
            color: #721c24;
            font-size: 0.9rem;
        }

        .account-info p {
            font-size: 0.95rem;
            margin: 4px 0;
        }
    </style>
</head>
<body>

<div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="admin-sidebar">
        <div class="admin-logo">
            <img src="../assets/images/logoD.png" alt="Detourist logo">
            <h2>Detourist</h2>
            <p>Admin Navigation</p>
        </div>

        <nav class="admin-nav">
            <form method="get" id="tabForm">
                <!-- We use buttons with JS to switch tab + query param -->
            </form>
            <button type="button"
                    class="<?= $activeTab === 'announcements' ? 'active' : '' ?>"
                    onclick="window.location.href='index.php?tab=announcements'">
                <span class="icon">🔔</span> Announcements
            </button>
            <button type="button"
                    class="<?= $activeTab === 'rooms' ? 'active' : '' ?>"
                    onclick="window.location.href='index.php?tab=rooms'">
                <span class="icon">🏫</span> Rooms
            </button>
            <button type="button"
                    class="<?= $activeTab === 'routes' ? 'active' : '' ?>"
                    onclick="window.location.href='index.php?tab=routes'">
                <span class="icon">🧭</span> Routes
            </button>
            <button type="button"
                    class="<?= $activeTab === 'account' ? 'active' : '' ?>"
                    onclick="window.location.href='index.php?tab=account'">
                <span class="icon">👤</span> Account
            </button>
        </nav>

        <div class="logout-link">
            <a href="logout.php">Log Out</a>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="admin-main">
        <div class="admin-topbar">
            Logged in as: <strong>&nbsp;<?= htmlspecialchars($_SESSION['admin_username']); ?></strong>
        </div>

        <!-- ANNOUNCEMENTS TAB -->
        <section class="admin-tab <?= $activeTab === 'announcements' ? 'active' : '' ?>" id="tab-announcements">
            <h1 class="section-title">Announcements</h1>

            <?php if ($annMsg): ?>
                <div class="msg-success"><?= htmlspecialchars($annMsg) ?></div>
            <?php endif; ?>

            <div class="card-box">
                <h2><?= $editAnnouncement ? 'Edit Announcement' : 'Add New Announcement' ?></h2>
                <form method="POST">
                    <input type="hidden" name="form_type" value="announcement">
                    <?php if ($editAnnouncement): ?>
                        <input type="hidden" name="announcement_id"
                               value="<?= (int)$editAnnouncement['announcement_id'] ?>">
                    <?php endif; ?>

                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" required
                           value="<?= $editAnnouncement ? htmlspecialchars($editAnnouncement['title']) : '' ?>">

                    <label for="message">Message:</label>
                    <textarea id="message" name="message" required><?= $editAnnouncement ? htmlspecialchars($editAnnouncement['message']) : '' ?></textarea>

                    <label for="created_at">Date &amp; Time:</label>
                    <input type="datetime-local" id="created_at" name="created_at"
                           value="<?= $editAnnouncement
                               ? date('Y-m-d\TH:i', strtotime($editAnnouncement['created_at']))
                               : date('Y-m-d\TH:i') ?>">

                    <button type="submit" class="btn-primary">Save Announcement</button>
                    <?php if ($editAnnouncement): ?>
                        <a href="index.php?tab=announcements" class="btn-secondary">Cancel</a>
                    <?php endif; ?>
                </form>
            </div>

            <div class="card-box">
                <h2>Existing Announcements</h2>
                <table class="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($announcements as $a): ?>
                        <tr>
                            <td><?= (int)$a['announcement_id'] ?></td>
                            <td><?= htmlspecialchars($a['title']) ?></td>
                            <td><?= htmlspecialchars($a['message']) ?></td>
                            <td><?= htmlspecialchars($a['created_at']) ?></td>
                            <td>
                                <a href="index.php?tab=announcements&edit=<?= (int)$a['announcement_id'] ?>">Edit</a> |
                                <a href="index.php?tab=announcements&delete=<?= (int)$a['announcement_id'] ?>"
                                   onclick="return confirm('Delete this announcement?');"
                                   style="color:#e74c3c;">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- ROOMS TAB (placeholder as per document) -->
        <section class="admin-tab <?= $activeTab === 'rooms' ? 'active' : '' ?>" id="tab-rooms">
            <h1 class="section-title">Rooms</h1>
            <div class="card-box">
                <p>Rooms management UI will be added here later (map + list) as shown in the document.</p>
            </div>
        </section>

        <!-- ROUTES TAB (placeholder) -->
        <section class="admin-tab <?= $activeTab === 'routes' ? 'active' : '' ?>" id="tab-routes">
            <h1 class="section-title">Routes</h1>
            <div class="card-box">
                <p>Routes management will be added here later as shown in the document.</p>
            </div>
        </section>

        <!-- ACCOUNT TAB -->
        <section class="admin-tab <?= $activeTab === 'account' ? 'active' : '' ?>" id="tab-account">
            <h1 class="section-title">Account</h1>

            <?php if ($accError): ?>
                <div class="msg-error"><?= htmlspecialchars($accError) ?></div>
            <?php endif; ?>
            <?php if ($accMsg): ?>
                <div class="msg-success"><?= htmlspecialchars($accMsg) ?></div>
            <?php endif; ?>

            <div class="card-box account-info">
                <h2>Account Information</h2>
                <p><strong>Username:</strong> <?= htmlspecialchars($currentAdmin['username']) ?></p>
                <p><strong>Email:</strong> <?= htmlspecialchars($currentAdmin['email']) ?></p>
            </div>

            <div class="card-box">
                <h2>Change Password</h2>
                <form method="POST">
                    <input type="hidden" name="form_type" value="password">

                    <label for="cp_username">Enter Username:</label>
                    <input type="text" id="cp_username" name="cp_username" required>

                    <label for="old_password">Enter Old Password:</label>
                    <input type="password" id="old_password" name="old_password" required>

                    <label for="new_password">Enter New Password:</label>
                    <input type="password" id="new_password" name="new_password" required>

                    <label for="new_password2">Enter Again New Password:</label>
                    <input type="password" id="new_password2" name="new_password2" required>

                    <button type="submit" class="btn-primary">Save</button>
                </form>
            </div>

            <div class="card-box">
                <h2>Change Username</h2>
                <form method="POST">
                    <input type="hidden" name="form_type" value="username">

                    <label for="old_username">Enter Old Username:</label>
                    <input type="text" id="old_username" name="old_username" required>

                    <label for="new_username">Enter New Username:</label>
                    <input type="text" id="new_username" name="new_username" required>

                    <label for="cu_password">Enter Password:</label>
                    <input type="password" id="cu_password" name="cu_password" required>

                    <button type="submit" class="btn-primary">Save</button>
                </form>
            </div>
        </section>

    </main>
</div>

</body>
</html>
