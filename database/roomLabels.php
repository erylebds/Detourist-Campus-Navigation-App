 <?php
    $servername = "localhost";
    $dbUsername = "root";
    $dbPassword = "";
    $dbname = "detourist";

    $conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
    if ($conn->connect_error) {
        die("<script>alert('Database connection failed');</script>");
    }

    $sql = "SELECT name, x_coord, y_coord FROM roomlabel";
    $result = $conn->query($sql);

    $roomLabels = [];
    while ($row = $result->fetch_assoc()) {
        $roomLabels[] = $row;
    }
    echo json_encode($roomLabels);
    $conn->close();
    ?> 