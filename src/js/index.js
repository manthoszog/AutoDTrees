$(function(){
    $("#loginb").hide();
    $("#logoutb").hide();

    if(sessionStorage.getItem("token") !== null){
        $("#loginb").hide();
        $("#mes").html("Logged in");        
        $("#mes2").html(sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname"));
        $("#logoutb").show();
        $("#logoutb").text("Logout");
    }
    else{
        $("#mes").html("Please Log in");
        $("#loginb").show();
        $("#loginb").text("Login");

    }

    $("#loginb").click(function(){
        window.location.href = './pages/login.html';
    });

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = './';
    });
});