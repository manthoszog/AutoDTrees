<?php
    require_once "dbconnect.php";

    function getdomain(){
        if(gethostname() == 'users.iee.ihu.gr'){
            $d = 'https://users.iee.ihu.gr/~it185179/webdtrees';
        }
        else{
            $d = 'localhost/webdtrees';
        }
        return $d;
    }

    function verif_key_exists($verif_key){
        $query = 'select count(*) as c from verify_account where verif_key=?';
        $st = $mysqli->prepare($query);
        $st->bind_param('s',$verif_key);
        $st->execute();
        $res = $st->get_result();
        $count = $res->fetch_assoc()['c'];
        
        if($count > 0){
            return true;
        }
        else{
            return false;
        }
    }

    function verif_key_expired($verif_key){
        $query = 'select count(*) as c from verify_account where verif_key=? and creation_time < (NOW() - INTERVAL 5 MINUTE)';
        $st = $mysqli->prepare($query);
        $st->bind_param('s',$verif_key);
        $st->execute();
        $res = $st->get_result();
        $count = $res->fetch_assoc()['c'];
    
        if($count > 0){
            $query2 = 'delete from verify_account where verif_key=?';
            $st2 = $mysqli->prepare($query2);
            $st2->bind_param('s',$verif_key);
            $st2->execute();
            return true;
        }
        else{
            return false;
        }
    }
?>