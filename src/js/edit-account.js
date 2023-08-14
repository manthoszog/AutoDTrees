$(function(){
    $("#logoutb").hide();
    $("#email_resend").hide();
    $("#loginb").hide();

    if(sessionStorage.getItem("token") !== null){
        $("#mes2").html(sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname"));
        $("#logoutb").show();
    }
    else{
        window.location.href = '../';

    }
    var token = sessionStorage.getItem("token");

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = '../';
    });

    $('#confbtn1').click(function(){
        var fname = $('#fname').val().trim();
        var lname = $('#lname').val().trim();
        var pass = $('#pass').val().trim();
        var new_pass = $('#new_pass').val().trim();
        var new_pass_confirm = $('#new_pass_confirm').val().trim();

        if((fname.length == 0) && (lname.length == 0) && (pass.length == 0) && (new_pass.length == 0) && (new_pass_confirm.length == 0)){
            $('#mes').html("You should edit at least one field.");
            return;
        }

        var edited_fields = {};

        if(fname.length > 0){
            if(fname == sessionStorage.getItem("fname")){
                $('#mes').html("Please enter a different first name from the existing.");
                return;
            }
            else{
                edited_fields.fname = fname;
            }
        }

        if(lname.length > 0){
            if(lname == sessionStorage.getItem("lname")){
                $('#mes').html("Please enter a different last name from the existing.");
                return;
            }
            else{
                edited_fields.lname = lname;
            }
        }

        if((pass.length > 0) && (new_pass.length == 0)){
            $('#mes').html("Please enter new password.");
            return;
        }

        if((pass.length == 0) && (new_pass.length > 0)){
            $('#mes').html("Please enter current password.");
            return;
        }

        if((pass.length > 0) && (new_pass.length > 0) && (new_pass_confirm.length == 0)){
            $('#mes').html("Please confirm your new password.");
            return;
        }

        if((new_pass_confirm.length > 0) && ((pass.length == 0) || (new_pass.length == 0))){
            $('#mes').html("Please fill all password related fields.");
            return;
        }

        if((pass.length > 0) && (new_pass.length > 0) && (new_pass_confirm.length > 0)){
            edited_fields.pass = pass;
            edited_fields.new_pass = new_pass;
            edited_fields.new_pass_confirm = new_pass_confirm;
        }

        edited_fields.token = token;

        $.ajax({
            url: '../server/php/api/edit-account.php',
            method: 'POST',
            data: JSON.stringify(edited_fields),
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                if(data.fname !== null){
                    sessionStorage.setItem("fname", data.fname);
                }
                if(data.lname !== null){
                    sessionStorage.setItem("lname", data.lname);
                }
                $("#mes2").html(sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname"));
                $('#mes').html("Changes saved successfully");
                $('#fname').val("");
                $('#lname').val("");
                $('#pass').val("");
                $('#new_pass').val("");
                $('#new_pass_confirm').val("");
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes').html(errormes);
            }
        });
    });

    $('#confbtn2').click(function(){ 
        var email = $('#email').val().trim();
        if(email.length == 0){
            $('#mes3').html("Enter your new email address");
            return;
        }

        if(email == sessionStorage.getItem("email")){
            $('#mes3').html("Please enter a different email address from the existing.");
            return;
        }

        $.ajax({
            url: '../server/php/api/edit-account.php',
            method: 'POST',
            data: JSON.stringify({email: email, token: token}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $('#mes3').html("Changes saved successfully. Please confirm your address, through the verification mail that has been sent, in order to continue.");
                $("#confbtn2").prop("disabled",true);
                $("#email").prop("disabled",true);
                $("#confbtn1").prop("disabled",true);
                $("#email_resend").show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes3').html(errormes);
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
                $('#mes3').html("Verification mail successfully sent");
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes3').html(errormes);
                if(errormes == "Account already verified."){
                    $("#logoutb").hide();
                    var newMes = '<div>Please log in again</div>';
                    $('#mes3').append(newMes);
                    sessionStorage.clear();
                    $("#loginb").show();
                }
            }
        });
    });

    $('#loginb').click(function(){
        window.location.href = 'login.html';
    });
});