<?php

$enable_viewer = true;
$db = "snap";
$user = "root";
$password = "testing123";
$host = "localhost";
$table = "trace";
// Note: don't lose this string! You must keep it the same or your users
// will all be lost. It must be 22+ characters
$salt = "random static salt of at least 22 characters";

// If true, user IDs will be hashed before saving to the database
$hashUserID = false;

// Choose a user table, could be the same as the "trace" table if allow new user
$user_table = "trace";
?>
