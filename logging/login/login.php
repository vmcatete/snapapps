<?php
include('../config.php');
    // single user login
    if (!array_key_exists('partner_id', $_POST)) {
        if (!array_key_exists('id', $_POST)) {
            return;
        }
        $id = strtolower($_POST['id']);
        $hash = $hashUserID ? password_hash($id, PASSWORD_DEFAULT, array(
            // Salt comes from the config file and is static
            'salt' => $salt
        )) : $id;

        $new = array_key_exists('new', $_POST) && $_POST['new'] === 'true';
        if (!$new) {
            $mysqli = new mysqli($host, $user, $password, $db);
            if ($mysqli->connect_errno) {
                http_response_code(503);
                die ("Failed to connect to MySQL: ($mysqli->errno) $mysqli->error");
            }
            $query = "SELECT 1 FROM $user_table WHERE userID='$hash' LIMIT 1";
            $result = $mysqli->query($query);
            if (!$result) {
                http_response_code(500);
                die ("Failed to retrieve data: ($mysqli->errno) $mysqli->error");
            }
            if ($result->num_rows === 0) {
                echo '{"newUser": true}';
                return;
            }
        }

        echo '{"userID": "' . $hash . '"}';
    }
    // pair programming login
    else {
        if (!array_key_exists('id', $_POST)) {
            return;
        }
        $id = strtolower($_POST['id']);
        $partner_id = strtolower($_POST['partner_id']);
        $hash_id = $hashUserID ? password_hash($id, PASSWORD_DEFAULT, array(
            // Salt comes from the config file and is static
            'salt' => $salt
        )) : $id;
        $hash_partner_id = $hashUserID ? password_hash($partner_id, PASSWORD_DEFAULT, array(
            // Salt comes from the config file and is static
            'salt' => $salt
        )) : $partner_id;

        $new = array_key_exists('new', $_POST) && $_POST['new'] === 'true';
        if (!$new) {
            $mysqli = new mysqli($host, $user, $password, $db);
            if ($mysqli->connect_errno) {
                http_response_code(503);
                die ("Failed to connect to MySQL: ($mysqli->errno) $mysqli->error");
            }
            $query_id = "SELECT 1 FROM $user_table WHERE userID='$hash_id' LIMIT 1";
            $result_id = $mysqli->query($query_id);
            $query_partner_id = "SELECT 1 FROM $user_table WHERE userID='$hash_partner_id' LIMIT 1";
            $result_partner_id = $mysqli->query($query_partner_id);

            if (!$result_id || !$result_partner_id) {
                http_response_code(500);
                die ("Failed to retrieve data: ($mysqli->errno) $mysqli->error");
            }
            if ($result_id->num_rows === 0 || $result_partner_id->num_rows === 0) {
                $msg = '{';
                if ($result_id->num_rows === 0) {
                    $msg = $msg . '"newUser": true';
                }
                if ($result_id->num_rows === 0 && $result_partner_id->num_rows === 0) {
                    $msg = $msg . ',';
                }
                if ($result_partner_id->num_rows === 0) {
                    $msg = $msg . '"newUserPartner": true';
                }
                $msg = $msg . '}';
                // echo '{"newUser": hahaha}';
                echo $msg;
                return;
            }
        }

        echo '{"userID": "' . $hash_id . '"}';
    }
?>