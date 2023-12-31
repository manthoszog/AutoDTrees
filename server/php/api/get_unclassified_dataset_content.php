<?php
    require_once "../dbconnect.php";
    require_once "../global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];

    if($method != "GET") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }

    if(!isset($_GET['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token is not set."]);
        exit;
    }

    if(!token_exists($_GET['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token doesn't exist."]);
        exit;
    }

    if(!isset($_GET['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select a file."]);
        exit;
    }

    $file = $_GET['file'];

    $email = user_mail($_GET['token']);

    $hash_user = md5($email);
    $file_path = "../../py/users/$hash_user/unclassified_datasets/$file";

    if(!file_exists($file_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"File doesn't exist."]);
        exit;
    }

    $countFields;
    $csv_array = array();
    $row = 0;
    if(($open_file = fopen($file_path, "r")) !== FALSE){
        while(($row_data = fgetcsv($open_file, 2048, ",")) !== FALSE){
            $countFields = count($row_data);
            for($i = 0; $i < $countFields; $i++){
                $csv_array[$row][$i] = $row_data[$i];
            }
            $row++;
        }
        fclose($open_file);
        if((count($csv_array)) < 3){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Please select a larger dataset."]);
            exit;
        }

        print json_encode(['csv_array'=>$csv_array]);
    }
    else{
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to read file."]);
        exit;
    }
?>