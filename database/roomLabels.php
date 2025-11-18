 <?php
    require 'connectDB.php';
    // select all room labels for images
    $sql = "SELECT * FROM roomlabel";
    $result = $conn->query($sql);

    $roomLabels = [];
    while ($row = $result->fetch_assoc()) {
    $roomLabels[] = $row;
    }
    echo json_encode($roomLabels);
    $conn->close();
    ?>