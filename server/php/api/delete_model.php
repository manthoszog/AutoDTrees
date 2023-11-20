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

    if(!isset($input['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select file to delete."]);
        exit;
    }

    $file = $input['file'];

    $email = user_mail($input['token']);

    $hash_user = md5($email);
    $file_path = "../../py/users/$hash_user/models/$file";

    if(!file_exists($file_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"File doesn't exist."]);
        exit;
    }
    
    $delete = unlink($file_path);
    
    if(!$delete){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Unable to delete file."]);
        exit;
    }

    $query = 'select id from users where token=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$input['token']);
    $st->execute();
    $res = $st->get_result();
    $id = $res->fetch_assoc()['id'];
    
    $query = 'delete from model_class where id=? and model_name=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('is',$id,$file);
    $st->execute();
    
    print json_encode(['message'=>"File successfully deleted."]);
?>