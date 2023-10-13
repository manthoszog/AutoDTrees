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

    if(!isset($input['pass_del'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Enter your password."]);
        exit;
    }

    if(!isset($input['pass_del_confirm'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Confirm your password."]);
        exit;
    }

    $query = 'select id,pass,email from users where token=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$input['token']);
    $st->execute();
    $res = $st->get_result();
    $res = $res->fetch_assoc();

    $id = $res['id'];
    $pass = $res['pass'];
    $email = $res['email'];

    if(!password_verify($input['pass_del'], $pass)){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Wrong password."]);
        exit;
    }

    if($input['pass_del'] != $input['pass_del_confirm']){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Passwords doesn't match."]);
        exit;
    }

    $hash_user = md5($email);
    try{
        $dir2 = deleteDir("../../py/users/$hash_user/datasets");
        $dir3 = deleteDir("../../py/users/$hash_user/models");
        $dir1 = rmdir("../../py/users/$hash_user");
    }catch(Exception $e){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to delete user's directory."]);
        exit;
    }
    if(!$dir1 || !$dir2 || !$dir3){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to delete user's directory."]);
        exit;
    }

    $query = 'delete from verify_account where id=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('i',$id);
    $st->execute();

    $query = 'delete from users where token=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$input['token']);
    $st->execute();

    print json_encode(['message'=>"Account successfully deleted."]);
?>