 <?php
    $servername = "localhost";
    $dbUsername = "root";
    $dbPassword = "";
    $dbname = "detourist";

    $conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
    if ($conn->connect_error) {
        die("<script>alert('Database connection failed');</script>");
    }

    $sql = "SELECT x_coord, y_coord FROM mapnode";
    $result = $conn->query($sql);

    $mapNodes = [];
    while ($row = $result->fetch_assoc()) {
        $mapNodes[] = $row;
    }
    echo json_encode($mapNodes);
    $conn->close();
    ?> 