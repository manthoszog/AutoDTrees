<?php
    require_once "../dbconnect.php";
    require_once "../global_functions.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'),true);

    if($method != "POST") {
        header("HTTP/1.1 405 Method Not Allowed");
        print json_encode(['errormesg'=>"Method not allowed."]);
        exit;
    }

    if(!isset($input['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token is not set."]);
        exit;
    }

    if(!token_exists($input['token'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Token doesn't exist."]);
        exit;
    }

    if(!isset($input['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select file."]);
        exit;
    }

    $file = $input['file'];

    if(!isset($input['model'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select model."]);
        exit;
    }

    $model = $input['model'];

    if(!isset($input['checkVal'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"You didn't select any numerical columns."]);
        exit;
    }

    $checkVal = $input['checkVal'];

    if(count($checkVal) == 0){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"You didn't select any numerical columns."]);
        exit;
    }

    $checkVal = str_replace(" ","_",$checkVal);

    if(!isset($input['className'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"You have to select a Class column."]);
        exit;
    }

    $className = $input['className'];
    $className = str_replace(" ","_",$className);
    
    $email = user_mail($input['token']);

    $hash_user = md5($email);
    $file_path = "../../py/users/$hash_user/unclassified_datasets/$file";

    if(!file_exists($file_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"File doesn't exist."]);
        exit;
    }

    $model_path = "../../py/users/$hash_user/models/$model";

    if(!file_exists($model_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Model doesn't exist."]);
        exit;
    }

    $name = $file;
    $name = substr($name,0,-4);
    $save_path = "../../py/users/$hash_user/models/$name" . "_classified.csv";

    $paths = glob("../../py/users/$hash_user/models/*.csv");
    if(count($paths) > 0){
        foreach($paths as $p){
            $delete = unlink($p);
            if(!$delete){
                header("HTTP/1.1 400 Bad Request");
                print json_encode(['errormesg'=>"An error has occured while trying to classify data."]);
                exit;
            }
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

        $num_fields = str_replace(" ","_",$num_fields);
        
        for($i = 0; $i < count($checkVal); $i++){
            $found = 0;
            for($j = 0; $j < count($num_fields); $j++){
                if($checkVal[$i] == $num_fields[$j]){
                    $found++;
                }
            }
            if($found == 0){
                header("HTTP/1.1 400 Bad Request");
                print json_encode(['errormesg'=>"Model features should match unclassified dataset's features."]);
                exit;
            }
        }

        $fields = str_replace(" ","_",$fields);
        
        $found2 = 0;
        for($i = 0; $i < count($fields); $i++){
            if($className == $fields[$i]){
                $found2++;
            }
        }
        if($found2 == 0){
            $className = 'None';
        }

        $checkValImplode = implode(",",$checkVal);
        $results;
        try{
            $results = shell_exec("python ../../py/classifyData.py $file_path $checkValImplode $model_path $save_path $className");
        }catch(Exception $e){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"An error has occured while trying to run the Python module for data classification."]);
            exit;
        }

        if(!$results || $results == null){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"An error has occured while trying to run the Python module for data classification."]);
            exit;
        }

        if(!file_exists($save_path)){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"An error has occured while trying to classify data."]);
            exit;
        }
        
        print($results);
    }
    else{
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to read file."]);
        exit;
    }
?>