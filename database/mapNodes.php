<?php
/*
    - Connects to the database via connectDB.php.
    - Defines a helper function `get_column_array` to extract a single column from a query result as an array.
    - Queries `mapnode` and joins with `roomlabel` to get node details (ID, name, type, coordinates).
    - For each node, fetches its adjacent nodes from the `mapedge` table in both directions.
    - Combines node data with adjacency information and outputs as JSON.
    - Closes the database connection at the end.
*/
?>
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