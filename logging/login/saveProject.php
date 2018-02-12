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
    $timestamp = date("Y-m-d H:i:s", $projectInfo['time'] / 1000);
    $data = $projectInfo['data'];
    $assignmentID = $mysqli->escape_string($projectInfo['assignmentID']);
    $table = $projectInfo['table'];

    if ($table) {
        $query = "INSERT INTO $lastSavedTable (time, assignmentID, userID, data)
            VALUES('$timestamp', '$assignmentID', '$userID', '$data');";
    }
    else {
        die("Saving failed: no table name provided.");
    }


    if (!$mysqli->query($query)) {
        // No need to retry, so don't return an error, but display the
        // message to indicate something went wrong
        die ("Saving failed: (" . $mysqli->errno . ") " . $mysqli->error);
    }

} catch (Exception $e) {
    http_response_code(500);
    die ("Error: " . $e);
}
?>