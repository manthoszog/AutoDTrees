<?php
    header("Access-Control-Allow-Origin: *");
    
    require_once "../dbconnect.php";
    require_once "../global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];

    if($method != "POST") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }

    if(!isset($_POST['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token is not set."]);
        exit;
    }

    if(!token_exists($_POST['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token doesn't exist."]);
        exit;
    }

    if(!isset($_FILES['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select a file to upload."]);
        exit;
    }
    
    $fileType = pathinfo($_FILES['file']['name'],PATHINFO_EXTENSION);

    if($fileType != "csv"){
        header("HTTP/1.1 415 Unsupported Media Type");
        print json_encode(['errormesg'=>"Only .csv files are supported."]);
        exit;
    }
    
    if($_FILES["file"]["size"] > 41943040){ 
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Max file size is 40 MB."]);
        exit;
    }
    
    $email = user_mail($_POST['token']);

    $hash_user = md5($email);
    $file_path = "../../py/users/$hash_user/unclassified_datasets/" . basename($_FILES['file']['name']);

    if(file_exists($file_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"File already exists."]);
        exit;
    }
    
    $upload = move_uploaded_file($_FILES["file"]["tmp_name"], $file_path);
    
    if(!$upload){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Unable to upload file."]);
        exit;
    }

    print json_encode(['message'=>"File successfully uploaded."]);
?>