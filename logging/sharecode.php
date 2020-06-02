<?php

include "config.php";

try {
    date_default_timezone_set('America/New_York');

    $mysqli = new mysqli($host, $user, $password, $viewer_db);
    if ($mysqli->connect_errno) {
        http_response_code(503);
        die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
    }

    $userID = $mysqli->escape_string($_GET['userID']);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $assignmentID = $mysqli->escape_string($_GET['assignmentID']);
        $code =  $mysqli->escape_string(file_get_contents("php://input"));

        if (!$code) {
            http_response_code(400);
            die("No log data provided.");
        }

        $query = "INSERT INTO sharecode (userID, assignmentID, code)
        VALUES('$userID', '$assignmentID', '$code');";


        if (!$mysqli->query($query)) {
            die ("Logging failed: (" . $mysqli->errno . ") " . $mysqli->error);
        }
    }
    else {
        $query = "SELECT code FROM sharecode
        WHERE userID = '$userID' 
        ORDER BY serverTime DESC LIMIT 1;";

        $result = $mysqli->query($query);
        if (!$result) {
            die ("Logging failed: (" . $mysqli->errno . ") " . $mysqli->error);
        }

        $row = mysqli_fetch_assoc($result);
        echo $row['code'];
    }

} catch (Exception $e) {
    http_response_code(500);
    die ("Error: " . $e);
}

?>
