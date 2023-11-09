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

    if(!isset($input['folder'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder."]);
        exit;
    }

    $folder = $input['folder'];

    if($folder != "private" && $folder != "public"){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select folder."]);
        exit;
    }

    if(!isset($input['file'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please select file."]);
        exit;
    }

    $file = $input['file'];

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
    
    if(!isset($input['selected'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"You have to select a Class column."]);
        exit;
    }

    $selected = $input['selected'];

    if($selected == 'default'){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"You have to select a Class column."]);
        exit;
    }

    if(!isset($input['max_depth'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please give the Max Depth."]);
        exit;
    }

    $max_depth = $input['max_depth'];
    if($max_depth == ""){
        $max_depth = 'None';
    }
    else{
        $max_depth = intval($max_depth);
        if($max_depth < 1){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"You should give a Max Depth >= 1."]);
            exit;
        }
    }

    if(!isset($input['min_samples_leafInt'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please give the Min samples/leaf."]);
        exit;
    }

    $min_samples_leaf = $input['min_samples_leafInt'];
    $min_samples_leafInt = intval($min_samples_leaf);
    if($min_samples_leafInt < 1){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"You should give a Min samples/leaf >= 1."]);
        exit;
    }

    if(!isset($input['kFoldsInt'])){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Please give the k value."]);
        exit;
    }

    $kFolds = $input['kFoldsInt'];
    $kFoldsInt = intval($kFolds);
    if(($kFoldsInt < 5) || ($kFoldsInt > 50)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Incorrect input for k. Range of accepted values: 5 - 50."]);
        exit;
    }

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
        $email = user_mail($input['token']);

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

        for($i = 0; $i < count($checkVal); $i++){
            $found = 0;
            for($j = 0; $j < count($num_fields); $j++){
                if($checkVal[$i] == $num_fields[$j]){
                    $found++;
                }
            }
            if($found == 0){
                header("HTTP/1.1 400 Bad Request");
                print json_encode(['errormesg'=>"Numerical column $checkVal[$i] doesn't exist."]);
                exit;
            }
        }

        $found2 = 0;
        for($i = 0; $i < count($fields); $i++){
            if($selected == $fields[$i]){
                $found2++;
            }
        }
        if($found2 == 0){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Class column $selected doesn't exist."]);
            exit;
        }

        for($i = 0; $i < count($checkVal); $i++){
            if($selected == $checkVal[$i]){
                header("HTTP/1.1 400 Bad Request");
                print json_encode(['errormesg'=>"You set $selected as both a Numerical and a Class column."]);
                exit;
            }
        }

        $checkVal = str_replace(" ","_",$checkVal);

        $selected = str_replace(" ","_",$selected);
        
        $checkValImplode = implode(",",$checkVal);
        $results;
        try{
            $results = shell_exec("python ../../py/dt_crossvalidation.py $file_path $checkValImplode $selected $max_depth $min_samples_leafInt $kFoldsInt");
        }catch(Exception $e){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"An error has occured while trying to run the Python module for Cross-Validation. <br><br> Please check the possibility of missing values existence in given columns and try again."]);
            exit;
        }

        if(!$results || $results == null){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"An error has occured while trying to run the Python module for Cross-Validation. <br><br> Please check the possibility of missing values existence in given columns and try again."]);
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