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

    if(!isset($_GET['folder'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder."]);
        exit;
    }

    $folder = $_GET['folder'];

    if($folder != "private" && $folder != "public"){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder."]);
        exit;
    }

    if(!isset($_GET['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select a file."]);
        exit;
    }

    $file = $_GET['file'];

    $file_path = "";

    if($folder == "public"){
        $file_path = "../../py/public/datasets/$file";

        if(!file_exists($file_path)){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"File doesn't exist."]);
            exit;
        }
    }
    else{
        $email = user_mail($_GET['token']);

        $hash_user = md5($email);
        $file_path = "../../py/users/$hash_user/datasets/$file";

        if(!file_exists($file_path)){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"File doesn't exist."]);
            exit;
        }
    }

    $countFields;
    $num_fields = array(); //only numerical fields
    $fields = array();
    $csv_array = array();
    $count2 = array();
    $row = 0;
    if(($open_file = fopen($file_path, "r")) !== FALSE){
        while(($row_data = fgetcsv($open_file, 2048, ",")) !== FALSE){
            $countFields = count($row_data);
            array_push($count2,$countFields);
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
        $countFields = max($count2);
        for($j = 0; $j < $countFields; $j++){
            $columns = array();
            for($i2 = 1; $i2 < count($csv_array); $i2++){
                array_push($columns,$csv_array[$i2][$j]);
            }
            if((count(array_filter($columns,"is_numeric"))) == (count($csv_array) - 1)){
                if($csv_array[0][$j] != ""){
                    array_push($num_fields,$csv_array[0][$j]);
                }
            }
        }

        for($j4 = 0; $j4 < $countFields; $j4++){
            $columns = array();
            $found = 0;
            for($i = 1; $i < count($csv_array); $i++){
                array_push($columns,$csv_array[$i][$j4]);
            }
            foreach($columns as $val){
                if(is_numeric($val) && (strpos($val,'.') !== false)){
                    $found++;
                }
                elseif(preg_match("@^(null|na|nan| |)$@i", $val)){
                    $found++;
                }
            }
            if($found == 0){
                if($csv_array[0][$j4] != ""){
                    array_push($fields,$csv_array[0][$j4]);
                }
            }
        }

        print json_encode(['csv_array'=>$csv_array,'numerical_fields'=>$num_fields,'fields'=>$fields]);
    }
    else{
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to read file."]);
        exit;
    }
?>