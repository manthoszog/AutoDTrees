<?php
    require_once "dbconnect.php";
    require_once "global_functions.php";
    require_once "phpmailer.php";

    $method = $_SERVER['REQUEST_METHOD'];

    if($method != "GET"){
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }
    
    if(!isset($_GET['email'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Email is not set."]);
        exit;
    }

    $email = $_GET['email'];

    $query = 'select count(*) as c from users where email=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$email);
    $st->execute();
    $res = $st->get_result();
    $count = $res->fetch_assoc()['c'];

    if($count == 0){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Account does not exist."]);
        exit;
    }

    $query = 'select count(*) as c from users where email=? and email_verif=1';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$email);
    $st->execute();
    $res = $st->get_result();
    $count2 = $res->fetch_assoc()['c'];

    if($count2 > 0){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Account already verified."]);
        exit;
    }

    $query = 'select id,fname from users where email=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$email);
    $st->execute();
    $res = $st->get_result();
    $res = $res->fetch_assoc();
    $id = $res['id'];
    $fname = $res['fname'];

    $query = 'select count(*) as c from verify_account where id=? and creation_time < (NOW() - INTERVAL 2 MINUTE)';
    $st = $mysqli->prepare($query);
    $st->bind_param('i',$id);
    $st->execute();
    $res = $st->get_result();
    $count3 = $res->fetch_assoc()['c'];

    if($count3 == 0){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Email can be resent every 2 minutes."]);
        exit;
    }

    $query = 'delete from verify_account where id=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('i',$id);
    $st->execute();
    
    $verif_key = md5(random_bytes(16));
    $query = 'insert into verify_account(id,verif_key) values(?,?)';
    $st = $mysqli->prepare($query);
    $st->bind_param('is',$id,$verif_key);
    $st->execute();

    $subject = 'Email verification - AutoDTrees App';
    $domain = getdomain();
    $email_body = "Account verification, please click <a href='$domain/pages/verification.html?verif_key=$verif_key'>here</a> or paste the following to your browser: $domain/pages/verification.html?verif_key=$verif_key";
    $alt_body = "Account verification, please paste the following to your browser: $domain/pages/verification.html?verif_key=$verif_key";
    
    try{
        send_mail($email,$fname,$subject,$email_body,$alt_body);
    }
    catch(Exception $e){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Mailer Error. Message could not be sent."]);
        exit;
    }

	print json_encode(['message'=>"Verification mail sent"]);
?>