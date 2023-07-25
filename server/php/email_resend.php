<?php
    require_once "dbconnect.php";
    require_once "global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);

    if($method != "POST"){
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }
    
    if(!isset($input['id'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"User verification error."]);
        exit;
    }

    $id = $input['id'];

    $query = 'select resend_count from users where id=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('i',$id);
    $st->execute();
    $res = $st->get_result();
    $count = $res->fetch_assoc()['resend_count'];

    if($count > 3){
        $query2 = 'delete from verify_account where id=?';
        $st2 = $mysqli->prepare($query2);
        $st2->bind_param('i',$id);
        $st2->execute();

        $query3 = 'delete from users where id=?';
        $st3 = $mysqli->prepare($query3);
        $st3->bind_param('i',$id);
        $st3->execute();
        
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Maximum limit of verification resending has exceeded. Please register again."]);
        exit;
    }

    $query = 'select email,fname from users where id=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('i',$id);
    $st->execute();
    $res = $st->get_result();
    $res = $res->fetch_assoc();
    $email = $res['email'];
    $fname = $res['fname'];

    $verif_key = md5(random_bytes(16));
    $query = 'insert into verify_account(id,verif_key) values(?,?)';
    $st = $mysqli->prepare($query);
    $st->bind_param('is',$id,$verif_key);
    $st->execute();

    $count2 = $count + 1;
    $query = 'update users set resend_count=? where id=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('ii',$count2,$id);
    $st->execute();

    $subject = 'Email verification - Web Decision Trees App';
    $domain = getdomain();
    $email_body = "Account verification, please click <a href='$domain/pages/verification.html?verif_key=$verif_key'>here</a> or paste the following to your browser: $domain/pages/verification.html?verif_key=$verif_key";
    $alt_body = "Account verification, please paste the following to your browser: $domain/pages/verification.html?verif_key=$verif_key";
    
    send_mail($email,$fname,$subject,$email_body,$alt_body);

	print json_encode(['message'=>"Verification mail sent"]);
?>