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


    $query = "SELECT DISTINCT teacher_id, display_name, period FROM (";
    $query.= "SELECT teacher_id, period FROM session LEFT JOIN user ON session.student_id = user.user_id WHERE user.user_name = '$user_name') AS teacher_period ";
    $query.= "LEFT JOIN user ON teacher_period.teacher_id = user.user_id ORDER BY display_name, period;";

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


    // $query = "SELECT DISTINCT teacher_id, display_name, period FROM (SELECT teacher_id, period FROM (SELECT * FROM session WHERE student_id = (SELECT user_id FROM user WHERE user_name = 'ydong2')) AS student_session LEFT JOIN user ON student_session.student_id = user.user_id LEFT JOIN assignment ON student_session.assignment_id = assignment.assignment_id WHERE NOW() BETWEEN start_date AND end_date) AS teacher_period LEFT JOIN user ON teacher_period.teacher_id = user.user_id ORDER BY display_name, period";

    echo json_encode($list);
?>
