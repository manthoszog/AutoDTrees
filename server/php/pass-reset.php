<?php
    require_once "dbconnect.php";
    require_once "global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);
    
    if($method != "POST") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }

    if(!isset($input['verif_key'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Verification key is not set."]);
        exit;
    }

    if(!isset($input['pass'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"New password is not set."]);
        exit;
    }

    if(!isset($input['pass_confirm'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Confirm your new password."]);
        exit;
    }

    $verif_key = $input['verif_key'];
    $pass = $input['pass'];
    $pass_confirm = $input['pass_confirm'];

    if(!verif_key_exists($verif_key)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Verification key doesn't exist."]);
        exit;
    }

    $email = verif_key_expired($verif_key);
    if($email != null){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Verification key expired."]);
        exit;
    }

    $uppercase = preg_match('@[A-Z]@', $pass);
    $lowercase = preg_match('@[a-z]@', $pass);
    $number = preg_match('@[0-9]@', $pass);

    if(!$uppercase || !$lowercase || !$number || strlen($pass) < 8) {
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Required 8 characters, 1 upper &amp; 1 digit."]);
        exit;
    }

    if($pass != $pass_confirm){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Passwords do not match."]);
        exit;
    }

    $pass_hash = password_hash($pass, PASSWORD_BCRYPT);

    $query = 'update users u join verify_account va on u.id=va.id set u.pass=? where va.verif_key=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('ss',$pass_hash,$verif_key);
    $st->execute();

    $query2 = 'delete from verify_account where verif_key=?';
    $st2 = $mysqli->prepare($query2);
    $st2->bind_param('s',$verif_key);
    $st2->execute();
    
    print json_encode(['message'=>"Password successfully updated."]);
?>