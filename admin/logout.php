<?php
session_start();
session_unset();
session_destroy();

// Send back to login page
header("Location: ../login.html");
exit();
?>
