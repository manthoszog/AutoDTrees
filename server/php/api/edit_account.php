<?php
    require_once "../dbconnect.php";
    require_once "../global_functions.php";
    require_once "../phpmailer.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);
    
    if($method != "POST") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }

    if(!isset($input['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please login first."]);
        exit;
    }

    if(!isset($input['fname']) && !isset($input['lname']) && !isset($input['email']) && !isset($input['pass']) && !isset($input['pass_confirm'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"You should edit at least one field."]);
        exit;
    }

    if(isset($input['fname'])){
        $query = 'update users set fname=? where token=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('ss',$input['fname'],$input['token']);
        $st->execute();
    }

    if(isset($input['lname'])){
        $query = 'update users set lname=? where token=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('ss',$input['lname'],$input['token']);
        $st->execute();
    }

    if(isset($input['email'])){
        $email = $input['email'];
        
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

        $query = 'update users set email=?, email_verif=0 where token=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('ss',$email,$input['token']);
        $st->execute();

        $query = 'select id from users where email=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('s',$email);
        $st->execute();
        $res = $st->get_result();
        $id = $res->fetch_assoc()['id'];

        $verif_key = md5(random_bytes(16));
        $query = 'insert into verify_account(id,verif_key) values(?,?)';
        $st = $mysqli->prepare($query);
        $st->bind_param('is',$id,$verif_key);
        $st->execute();

        $subject = 'Email verification - Web Decision Trees App';
        $domain2 = getdomain();
        $email_body = "Email verification, please click <a href='$domain2/pages/verification.html?verif_key=$verif_key'>here</a> or paste the following to your browser: $domain2/pages/verification.html?verif_key=$verif_key";
        $alt_body = "Email verification, please paste the following to your browser: $domain2/pages/verification.html?verif_key=$verif_key";
        
        send_mail($email,$input['fname'],$subject,$email_body,$alt_body);

        print json_encode(['message'=>"Verification mail sent"]);
    }
?>