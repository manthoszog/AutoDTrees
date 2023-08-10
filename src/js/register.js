$(function(){
    if(sessionStorage.getItem("token") !== null){
        window.location.href = '../';
    }

    $("#email_resend").hide();

    $('#regbtn').click(function(){
        var fname = $('#fname').val().trim();
        var lname = $('#lname').val().trim();
        var email = $('#email').val().trim();
        var pass = $('#pass').val().trim();
        var pass_confirm = $('#pass_confirm').val().trim();

        if(fname.length == 0){
            $('#mes').html("Enter your first name");
            return;
        }

        if(lname.length == 0){
            $('#mes').html("Enter your last name");
            return;
        }
        
        if(email.length == 0){
            $('#mes').html("Enter your email");
            return;
        }

        if(pass.length == 0){
            $('#mes').html("Enter your password");
            return;
        }

        if(pass_confirm.length == 0){
            $('#mes').html("Confirm your password");
            return;
        }

        $.ajax({
            url: '../server/php/api/register.php',
            method: 'POST',
            data: JSON.stringify({fname: fname, lname: lname, email: email, pass: pass, pass_confirm: pass_confirm}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $('#mes').html("User registered, verification mail sent");
                $("#regbtn").prop("disabled",true);
                $("#email_resend").show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes').html(errormes);
            }
        });
    });

    $('#email_resend').click(function(){
        var email2 = $('#email').val().trim();
        var link = '../server/php/email_resend.php?email=' + email2;

        $.ajax({
            url: link,
            method: 'GET',
            success: function(){
                $('#mes').html("Email successfully sent");
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes').html(errormes);
            }
        });
    });
});