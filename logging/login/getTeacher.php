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
    $query = "SELECT user_id, display_name FROM user where user_id IN (";
    $query.= "SELECT teacher_id FROM session LEFT JOIN user ON session.student_id = user.user_id WHERE user.user_name = '$user_name'";
    $query.= ")";

    $result = $mysqli->query($query);
    if (!$result) {
        http_response_code(500);
        die ("Failed to retrieve data: ($mysqli->errno) $mysqli->error");
    }
    $list = array();
    while($row = mysqli_fetch_array($result)) {
        $teacher['teacher_id'] = $row['user_id'];
        $teacher['display_name'] = $row['display_name'];
        array_push($list, $teacher);
    }
    echo json_encode($list);
?>