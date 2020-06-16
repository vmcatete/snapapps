<?php
include('../config.php');
    if (!array_key_exists('user_id', $_POST)) {
        return;
    }
    if (!array_key_exists('teacher_id', $_POST)) {
        return;
    }
    $user_id = $_POST['user_id'];
    $teacher_id = $_POST['teacher_id'];
    $user_type = 'student';

    if (array_key_exists('user_type', $_POST)) {
        $user_type = $_POST['user_type'];
    }

    $mysqli = new mysqli($host, $user, $password, $db);
    if ($mysqli->connect_errno) {
        http_response_code(503);
        die ("Failed to connect to MySQL: ($mysqli->errno) $mysqli->error");
    }
    $query = "";

    if ($user_type === 'student') {
        $query = "SELECT assignment_id, assignment_file_name, assignment_name, environment FROM `assignment` WHERE assignment_id IN (SELECT assignment_id FROM session WHERE student_id = '$user_id' and teacher_id = '$teacher_id') AND (NOW() BETWEEN start_date AND end_date)";
    }
    else if ($user_type === 'teacher') {
        $query = "SELECT assignment_id, assignment_file_name, assignment_name, environment FROM `assignment` WHERE assignment_id IN (SELECT assignment_id FROM session WHERE teacher_id = '$user_id') AND (NOW() BETWEEN start_date AND end_date)";
    }
    else {
        echo json_encode(array());
        return;
    }

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
    mysqli_close($mysqli);
    return;
?>

