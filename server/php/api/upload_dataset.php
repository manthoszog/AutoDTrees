<?php
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

    if(!isset($_POST['folder'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder to save."]);
        exit;
    }

    $folder = $_POST['folder'];

    if($folder != "private" && $folder != "public"){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder to save."]);
        exit;
    }

    if(!isset($_FILES['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select a file to upload."]);
        exit;
    }
    
    $fileType = pathinfo($_FILES['file']['name'],PATHINFO_EXTENSION);

    if($fileType != "csv" && $fileType != "xls" && $fileType != "xlsx"){
        header("HTTP/1.1 415 Unsupported Media Type");
        print json_encode(['errormesg'=>"Only csv, xls or xlsx files are supported."]);
        exit;
    }
    
    if($_FILES["file"]["size"] > 1048576){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Max file size is 1 MB."]);
        exit;
    }
    
    $upload = false;

    if($folder == "public"){
        $query = 'select allowPublic from users where token=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('s',$_POST['token']);
        $st->execute();
        $res = $st->get_result();
        $allowPublic = $res->fetch_assoc()['allowPublic']; 
        //Check if user's allowed to upload public data.

        if($allowPublic == 0){
            header("HTTP/1.1 403 Forbidden");
            print json_encode(['errormesg'=>"You aren't allowed to upload public data."]);
            exit;
        }
        
        $file_path = "../../py/public/datasets/" . basename($_FILES['file']['name']);
    
        if(file_exists($file_path)){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"File already exists."]);
            exit;
        }
        
        $upload = move_uploaded_file($_FILES["file"]["tmp_name"], $file_path);

    }
    else{
        $query = 'select email from users where token=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('s',$_POST['token']);
        $st->execute();
        $res = $st->get_result();
        $email = $res->fetch_assoc()['email'];

        $hash_user = md5($email);
        $file_path = "../../py/users/$hash_user/datasets/" . basename($_FILES['file']['name']);

        if(file_exists($file_path)){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"File already exists."]);
            exit;
        }
        
        $upload = move_uploaded_file($_FILES["file"]["tmp_name"], $file_path);
    }
    
    if(!$upload){
        print json_encode(['errormesg'=>"Unable to upload file."]);
        exit;
    }

    print json_encode(['message'=>"File successfully uploaded."]);
?>