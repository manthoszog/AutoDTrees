<?php
    
    function getdomain(){
        if(gethostname() == 'users.iee.ihu.gr'){
            $d = 'https://users.iee.ihu.gr/~it185179/webdtrees';
        }
        else{
            $d = 'localhost/webdtrees';
        }
        return $d;
    }

?>