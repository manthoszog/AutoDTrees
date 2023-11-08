<?php
    require_once "../dbconnect.php";
    require_once "../global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];

    if($method != "GET") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }
    
    if(!isset($_GET['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token is not set."]);
        exit;
    }

    if(!token_exists($_GET['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token doesn't exist."]);
        exit;
    }

    if(!isset($_GET['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select a file."]);
        exit;
    }

    $file = $_GET['file'];

    $email = user_mail($_GET['token']);

    $hash_user = md5($email);
    $file_path = "../../py/users/$hash_user/models/$file";

    if(!file_exists($file_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"File doesn't exist."]);
        exit;
    }

    $results;
    try{
        $results = shell_exec("python ../../py/get_model_content.py $file_path");
    }catch(Exception $e){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to run the Python module."]);
        exit;
    }

    if(!$results || $results == null){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to run the Python module."]);
        exit;
    }

    print($results);
?>