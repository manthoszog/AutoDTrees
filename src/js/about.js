$(function(){

    if(sessionStorage.getItem("token") !== null){
        $("#loginb").hide();
        $("#regbtn").hide();
        $("#acc_dropdown").show();
        $("#username").html($(`<i class="bi bi-person-circle"></i><span style="margin-left: 10px;">${sessionStorage.getItem("fname")} ${sessionStorage.getItem("lname")}</span>`));
    }
    else{
        $("#acc_dropdown").hide();
    }

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = '../';
    });
});