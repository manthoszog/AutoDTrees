<?php
    require_once "../dbconnect.php";
    require_once "../global_functions.php";

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
    $file_path = "../../py/users/$hash_user/models/$file";

    if(!file_exists($file_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"File doesn't exist."]);
        exit;
    }

    $name = $file;
    $name = substr($name,0,-4);

    $tree_path = "../../py/users/$hash_user/models/$name" . "_tree.png";
    
    if(file_exists($tree_path)){
        $delete = unlink($tree_path);
        if(!$delete){
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"An error has occured while trying to visualize tree."]);
            exit;
        }
    }

    $results;
    try{
        $results = shell_exec("python ../../py/visualize_tree.py $file_path $tree_path");
    }catch(Exception $e){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to run the Python module for tree visualization."]);
        exit;
    }

    if(!$results || $results == null){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to run the Python module for tree visualization."]);
        exit;
    }

    if(!file_exists($tree_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to visualize tree."]);
        exit;
    }

    $file2 = "$name" . "_tree.png";

    header("Content-Description: File Transfer");
    header('Content-Disposition: attachment; filename="' . $file2 . '"');
    header("Content-Transfer-Encoding: Binary");

    readfile($tree_path);
?>