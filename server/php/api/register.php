<?php
    require_once "../dbconnect.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);
    
    if($method != "POST") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }
    
    if(!isset($input['fname'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"First name is not set."]);
        exit;
    }
    
    if(!isset($input['lname'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Last name is not set."]);
        exit;
    }

    if(!isset($input['email'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Email is not set."]);
        exit;
    }
    
    if(!isset($input['pass'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Password is not set."]);
        exit;
    }

    if(!isset($input['pass_confirm'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Confirm your password."]);
        exit;
    }
    
    $fname = $input['fname'];
    $lname = $input['lname'];
    $email = $input['email'];
    $pass = $input['pass'];
    $pass_confirm = $input['pass_confirm'];

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Set a valid email."]);
        exit;
    }

    $atPos = mb_strpos($email, '@');
    $domain = mb_substr($email, $atPos + 1);
    if(!checkdnsrr($domain . '.', 'MX')){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Set a valid email."]);
        exit;
    }

    $query = 'select count(*) as c from users where email=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$email);
    $st->execute();
    $res = $st->get_result();
    $count = $res->fetch_assoc()['c'];

    if($count > 0){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Email already exists."]);
        exit;
    }

    $uppercase = preg_match('@[A-Z]@', $pass);
    $lowercase = preg_match('@[a-z]@', $pass);
    $number = preg_match('@[0-9]@', $pass);

    if(!$uppercase || !$lowercase || !$number || strlen($pass) < 8) {
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Password should contain at least 8 characters, including one upper case letter and one number."]);
        exit;
    }

    if($pass != $pass_confirm){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Passwords do not match."]);
        exit;
    }

    $pass_hash = password_hash($pass, PASSWORD_BCRYPT);

    $query = 'insert into users(fname, lname, email, pass, token) values(?,?,?,?,md5(CONCAT( ?, NOW())))';
    $st = $mysqli->prepare($query);
    $st->bind_param('sssss',$fname,$lname,$email,$pass_hash,$fname);
    $st->execute();

    //should now create an email verification token.
?>