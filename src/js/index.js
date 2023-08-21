$(function(){

    if(sessionStorage.getItem("token") !== null){
        $("#loginb").hide();
        $("#regbtn").hide();
        $("#acc_dropdown").show();
        $("#username").text(sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname"));
    }
    else{
        $("#acc_dropdown").hide();
    }

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = './';
    });
});