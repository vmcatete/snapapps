<?php
    include('../config.php');

    echo '{"userID": "' . $_POST['id'] . '", "tablename": "' . $lastSavedTable . '"}';

?>