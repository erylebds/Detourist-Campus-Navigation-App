 <?php

    require 'connectDB.php';

    function get_column_array($conn, $query, $column)
    {
        $mysqliResult = $conn->query($query);
        $result = [];
        while ($row = $mysqliResult->fetch_assoc()) {
            $result[] = $row[$column];
        }
        return $result;
    }

    $nodesQuery = "SELECT mapnode.id, roomlabel.name, mapnode.type, mapnode.x_coord, mapnode.y_coord 
        FROM mapnode LEFT JOIN roomlabel 
        ON mapnode.room_label_id=roomlabel.id;";
    $dbNodes = $conn->query($nodesQuery);

    $mapNodes = [];
    while ($row = $dbNodes->fetch_assoc()) {
        $currentNodeId = $row["id"];
        $row["adjacent_node_ids"] = array_values(
            array_merge(
                get_column_array(
                    $conn,
                    "SELECT adjacent_node_id FROM mapedge WHERE map_node_id={$currentNodeId};",
                    "adjacent_node_id"
                ),
                get_column_array(
                    $conn,
                    "SELECT map_node_id FROM mapedge WHERE adjacent_node_id={$currentNodeId};",
                    "map_node_id"
                )
            )
        );
        $mapNodes[] = $row;
    }
    echo json_encode($mapNodes);
    $conn->close();
    ?> 