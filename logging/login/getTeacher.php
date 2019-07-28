<?php
include('../config.php');
    if (!array_key_exists('user_id', $_POST)) {
        return;
    }
    $user_id = $_POST['user_id'];
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
        $query = "SELECT DISTINCT teacher_id, display_name, period FROM (SELECT teacher_id, period FROM (SELECT * FROM session WHERE student_id = '$user_id') AS student_session LEFT JOIN assignment ON student_session.assignment_id = assignment.assignment_id WHERE NOW() BETWEEN start_date AND end_date) AS teacher_period LEFT JOIN user ON teacher_period.teacher_id = user.user_id ORDER BY display_name, period";
    }
    else if ($user_type === 'teacher') {
        $query = "SELECT DISTINCT teacher_id, display_name, period FROM (SELECT teacher_id, period FROM (SELECT * FROM session WHERE teacher_id = '$user_id') AS teacher_session LEFT JOIN assignment ON teacher_session.assignment_id = assignment.assignment_id WHERE NOW() BETWEEN start_date AND end_date) AS teacher_period LEFT JOIN user ON teacher_period.teacher_id = user.user_id ORDER BY display_name, period";
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
        $teacher['teacher_id'] = $row['teacher_id'];
        $teacher['period'] = $row['period'];
        $teacher['display_name'] = $row['display_name'];
        array_push($list, $teacher);
    }

    echo json_encode($list);

?>
