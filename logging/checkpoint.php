<?php

include "config.php";

try {
    date_default_timezone_set('America/New_York');

    $mysqli = new mysqli($host, $user, $password, $db);
    if ($mysqli->connect_errno) {
        http_response_code(503);
        die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
    }

    $userIDA = $mysqli->escape_string($_GET['userIDA']);
    $userIDB = $mysqli->escape_string($_GET['userIDB']);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $code =  $mysqli->escape_string(file_get_contents("php://input"));
        $guid = $mysqli->escape_string($_GET['guid']);
        $fromUserA = $mysqli->escape_string($_GET['fromUserA']);

        if (!$code) {
            http_response_code(400);
            die("No log data provided.");
        }

        $query = "INSERT INTO checkpoints (guid, userIDA, userIDB, fromUserA, code)
        VALUES('$guid', '$userIDA', '$userIDB', '$fromUserA', '$code');";


        if (!$mysqli->query($query)) {
            die ("Logging failed: (" . $mysqli->errno . ") " . $mysqli->error);
        }

    } else {
        // TODO: confirm
        $query = "SELECT code FROM checkpoints
        WHERE userIDA = '$userIDA' AND userIDB = '$userIDB'
        AND NOW() - serverTime < 90
        ORDER BY serverTime DESC;
        ";

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
