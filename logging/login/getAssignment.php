<?php
include('../config.php');
    if (!array_key_exists('user_name', $_POST)) {
        return;
    }
    if (!array_key_exists('teacher_id', $_POST)) {
        return;
    }
    $user_name = $_POST['user_name'];
    $teacher_id = $_POST['teacher_id'];

    $mysqli = new mysqli($host, $user, $password, $db);
    if ($mysqli->connect_errno) {
        http_response_code(503);
        die ("Failed to connect to MySQL: ($mysqli->errno) $mysqli->error");
    }
    $query = "SELECT assignment_id, assignment_file_name, assignment_name, environment FROM `assignment` WHERE assignment_id IN (";
    $query.= "SELECT assignment_id FROM session LEFT JOIN user ON session.student_id = user.user_id WHERE user.user_name = '$user_name' and session.teacher_id = '$teacher_id') ";
    $query.= "AND (NOW() BETWEEN start_date AND end_date)";

    $result = $mysqli->query($query);
    if (!$result) {
        http_response_code(500);
        die ("Failed to retrieve data: ($mysqli->errno) $mysqli->error");
    }
    $list = array();
    while($row = mysqli_fetch_array($result)) {
        $assignment['assignment_id'] = $row['assignment_id'];
        $assignment['assignment_file_name'] = $row['assignment_file_name'];
        $assignment['assignment_name'] = $row['assignment_name'];
        $assignment['environment'] = $row['environment'];
        array_push($list, $assignment);
    }
    echo json_encode($list);
?>

