<?php
/*
This PHP script handles user logout by:
1. Starting the session.
2. Clearing all session variables.
3. Destroying the session.
4. Redirecting the user back to the login page.
*/
?>

<?php
session_start();
session_unset();
session_destroy();

header("Location: ../login.html");
exit();
?>
