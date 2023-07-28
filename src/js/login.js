$(function(){
    if(sessionStorage.getItem("token") !== null){
        window.location.href = '../';
    }

    $('#loginbtn').click(function(){
        var email = $('#email').val().trim();
        var pass = $('#pass').val().trim();
        console.log(email);
        console.log(pass);
        if(email.length == 0){
            $('#mes').html("Enter your email");
            return;
        }

        if(pass.length == 0){
            $('#mes').html("Enter your password");
            return;
        }

        $.ajax({
            url: '../server/php/api/login.php',
            method: 'POST',
            data: JSON.stringify({email: email, pass: pass}),
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                sessionStorage.setItem("email", data.email);
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("fname", data.fname);
                sessionStorage.setItem("lname", data.lname);
                window.location.href = '../';
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes').html(errormes);
            }
        });
    });
});