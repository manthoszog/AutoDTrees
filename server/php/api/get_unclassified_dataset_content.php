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
    $num_fields = array(); //only numerical fields
    $csv_array = array();
    $count2 = array();
    $csv_array2 = array();
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
        for($i3 = 0; $i3 <= 10; $i3++){
            for($j3 = 0; $j3 < $countFields; $j3++){
                $csv_array2[$i3][$j3] = $csv_array[$i3][$j3];
            }
        }

        print json_encode(['csv_array'=>$csv_array2,'numerical_fields'=>$num_fields]);
    }
    else{
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to read file."]);
        exit;
    }
?>