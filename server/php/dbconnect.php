<?php
    require_once "db_upass.php";

    $host = 'localhost';
    $db = 'autodtrees_db';

    $user_local = $DB_USER_LOCAL;       //username for localhost
    $user_server = $DB_USER_SERVER;     //username for server
    $pass = $DB_PASS;                   

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    if(gethostname()=='users.iee.ihu.gr') {
        $mysqli = new mysqli($host, $user_server, $pass, $db,null,'/home/student/it/2018/it185179/mysql/run/mysql.sock');
    } 
    else {
        $pass=null;
        $mysqli = new mysqli($host, $user_local, $pass, $db);
    }

    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: (" . 
        $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
?>