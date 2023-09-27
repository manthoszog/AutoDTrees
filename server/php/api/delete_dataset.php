<?php
    require_once "../dbconnect.php";
    require_once "../global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);
    
    if($method != "DELETE") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }

    if(!isset($input['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token is not set."]);
        exit;
    }

    if(!token_exists($input['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token doesn't exist."]);
        exit;
    }

    if(!isset($input['folder'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder."]);
        exit;
    }

    $folder = $input['folder'];

    if($folder != "private" && $folder != "public"){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder."]);
        exit;
    }

    if(!isset($input['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select file to delete."]);
        exit;
    }

    $file = $input['file'];

    $delete = false;

    if($folder == "public"){
        $query = 'select allowPublic from users where token=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('s',$input['token']);
        $st->execute();
        $res = $st->get_result();
        $allowPublic = $res->fetch_assoc()['allowPublic']; 
        //Check if user's allowed to delete public data.

        if($allowPublic == 0){
            header("HTTP/1.1 403 Forbidden");
            print json_encode(['errormesg'=>"You aren't allowed to delete public data."]);
            exit;
        }
        
        $file_path = "../../py/public/datasets/$file";
    
        if(!file_exists($file_path)){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"File doesn't exist."]);
            exit;
        }
        
        $delete = unlink($file_path);

    }
    else{
        $email = user_mail($input['token']);

        $hash_user = md5($email);
        $file_path = "../../py/users/$hash_user/datasets/$file";

        if(!file_exists($file_path)){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"File doesn't exist."]);
            exit;
        }
        
        $delete = unlink($file_path);
    }
    
    if(!$delete){
        print json_encode(['errormesg'=>"Unable to delete file."]);
        exit;
    }

    print json_encode(['message'=>"File successfully deleted."]);
?>