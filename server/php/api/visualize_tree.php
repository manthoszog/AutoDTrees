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
    $file_path = "../../py/users/$hash_user/models/$file";

    if(!file_exists($file_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"Model doesn't exist."]);
        exit;
    }

    $name = $file;
    $name = substr($name,0,-4);

    $tree_path = "../../py/users/$hash_user/models/$name" . "_tree.png";
    $tree_pathDot = "../../py/users/$hash_user/models/$name" . "_tree.dot";

    $paths = glob("../../py/users/$hash_user/models/*.png");
    if(count($paths) > 0){
        foreach($paths as $p){
            $delete = unlink($p);
            if(!$delete){
                header("HTTP/1.1 400 Bad Request");
                print json_encode(['errormesg'=>"An error has occured while trying to visualize tree."]);
                exit;
            }
        }
    }

    $pathsDot = glob("../../py/users/$hash_user/models/*.dot");
    if(count($pathsDot) > 0){
        foreach($pathsDot as $p){
            $delete = unlink($p);
            if(!$delete){
                header("HTTP/1.1 400 Bad Request");
                print json_encode(['errormesg'=>"An error has occured while trying to visualize tree."]);
                exit;
            }
        }
    }

    $tree_path2 = "../../py/users/$hash_user/models/$name" . "_tree";

    $results;
    try{
        $results = shell_exec("python3 ../../py/visualize_tree.py $file_path $tree_path2");
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

    if(!file_exists($tree_pathDot)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while trying to visualize tree."]);
        exit;
    }
    try{
        shell_exec("/var/www/html/webkmeans/kclusterhub/autodtrees/miniconda3/bin/dot -Tpng $tree_pathDot -o $tree_path");
    }catch(Exception $e){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while rendering the tree."]);
        exit;
    }
    if(!file_exists($tree_path)){
        header("HTTP/1.1 400 Bad Request");
        print json_encode(['errormesg'=>"An error has occured while rendering the tree."]);
        exit;
    }
    $domain = getdomain();

    $file2 = "$domain/server/py/users/$hash_user/models/$name" . "_tree.png";
    print json_encode(['image'=>$file2], JSON_UNESCAPED_SLASHES);
?>