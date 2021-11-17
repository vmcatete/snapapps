<?php
include('../config.php');
    if (!array_key_exists('user_name', $_POST)) {
        return;
    }
    $user_name = $_POST['user_name'];

    $mysqli = new mysqli($host, $user, $password, $db);
    if ($mysqli->connect_errno) {
        http_response_code(503);
        die ("Failed to connect to MySQL: ($mysqli->errno) $mysqli->error");
    }


    $query = "SELECT user_id, user_name, user_type, display_name FROM user WHERE user_name = '$user_name'";

    $result = $mysqli->query($query);
    if (!$result) {
        http_response_code(500);
        die ("Failed to retrieve data: ($mysqli->errno) $mysqli->error");
    }

    if ($result->num_rows === 0) {
        echo 'new user';
    } else {
        $row = mysqli_fetch_assoc($result);

        echo json_encode($row);
    }
?>
