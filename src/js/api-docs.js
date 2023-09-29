$(function(){

    if(sessionStorage.getItem("token") !== null){
        $("#username").text(sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname"));
    }
    else{
        window.location.href = 'login.html';
    }

    var token = sessionStorage.getItem("token");

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = '../';
    });
});