<?php
    include('../config.php');

    //echo '{"userID": "' . $_POST['id'] . '", "tablename": "' . $lastSavedTable . '"}';
try {
    date_default_timezone_set('America/New_York');
    
    $mysqli = new mysqli($host, $user, $password, $db);
    if ($mysqli->connect_errno) {
        http_response_code(503);
        die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
    }

    $post = file_get_contents("php://input");
    $projectInfo = json_decode($post, true);

    if (!$projectInfo) {
        http_response_code(400);
        die("No log data provided.");
    }

    $userID = $projectInfo['userID'];

    $query = "SELECT data FROM $lastSavedTable WHERE userID = '$userID' and time = (SELECT MAX(time) FROM $lastSavedTable WHERE userID = '$userID' GROUP BY userID)";
    
    $result = $mysqli->query($query);
    if (!$result) {
        http_response_code(500);
        die ("Failed to retrieve project: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo $row["data"];
    }
    
    $result->free();
    $mysqli->close();
    
} catch (Exception $e) {
    http_response_code(500);
    die ("Error: " . $e);
}
?>