 <?php
    require 'connectDB.php';

    $sql = "SELECT name, x_coord, y_coord FROM roomlabel";
    $result = $conn->query($sql);

    $roomLabels = [];
    while ($row = $result->fetch_assoc()) {
        $roomLabels[] = $row;
    }
    echo json_encode($roomLabels);
    $conn->close();
    ?> 