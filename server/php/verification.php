<?php
    require_once "dbconnect.php";
    require_once "global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);

    if($method != "GET") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }
    
    if(!isset($input['verif_key'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Verification key is not set."]);
        exit;
    }

    $verif_key = $input['verif_key'];

    if(!verif_key_exists($verif_key)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Verification key doesn't exist."]);
        exit;
    }

    $id = verif_key_expired($verif_key);
    if($id != null){
        $data = array(
            'errormesg' => "Verification key expired.",
            'id' => $id
          );
        header("HTTP/1.1 400 Bad Request");
        print json_encode($data);
        exit;
    }

    $query = 'update users u join verify_account va on u.id=va.id set u.email_verif=1 where va.verif_key=?';
    $st = $mysqli->prepare($query);
    $st->bind_param('s',$verif_key);
    $st->execute();

    $query3 = 'select u.email as address from users u join verify_account va on u.id=va.id where va.verif_key=?';
    $st3 = $mysqli->prepare($query3);
    $st3->bind_param('s',$verif_key);
    $st3->execute();
    $res3 = $st3->get_result();
    $email = $res3->fetch_assoc()['address'];

    $query2 = 'delete from verify_account where verif_key=?';
    $st2 = $mysqli->prepare($query2);
    $st2->bind_param('s',$verif_key);
    $st2->execute();   
    
    $hash_user = md5($email);
	mkdir("../py/users/$hash_user/datasets");
    mkdir("../py/users/$hash_user/models");

    print json_encode(['message'=>"Successfully registered."]);
?>