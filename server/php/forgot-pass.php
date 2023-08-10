<?php
    require_once "dbconnect.php";
    require_once "global_functions.php";
    require_once "phpmailer.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);
    
    if($method != "POST") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }

    if(!isset($input['email'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Email is not set."]);
        exit;
    }

    $email = $input['email'];

    $query = 'select count(*) as c from users where email=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$email);
    $st->execute();
    $res = $st->get_result();
    $count = $res->fetch_assoc()['c'];

    if($count == 0){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Account doesn't exist."]);
        exit;
    }

    $query = 'select email_verif,fname,id from users where email=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$email);
    $st->execute();
    $res = $st->get_result();
    $res = $res->fetch_assoc();

    $fname = $res['fname'];
    $id = $res['id'];

    if(!$res['email_verif']){
        header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Account did not verified."]);
        exit;
    }
    
    $verif_key = md5(random_bytes(16));
    $query = 'insert into verify_account(id,verif_key) values(?,?)';
    $st = $mysqli->prepare($query);
    $st->bind_param('is',$id,$verif_key);
    $st->execute();

    $query = 'update users set email_verif=0 where id=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('i',$id);
    $st->execute();

    $subject = 'Reset Password - Web Decision Trees App';
    $domain2 = getdomain();
    $email_body = "Password reset, please click <a href='$domain2/pages/pass-reset.html?verif_key=$verif_key'>here</a> or paste the following to your browser: $domain2/pages/pass-reset.html?verif_key=$verif_key";
    $alt_body = "Account verification, please paste the following to your browser: $domain2/pages/pass-reset.html?verif_key=$verif_key";
    
    send_mail($email,$fname,$subject,$email_body,$alt_body);

	print json_encode(['message'=>"Verification mail sent"]);
?>