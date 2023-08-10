$(function(){
    $("#email_resend").hide();

    $('#confbtn').click(function(){
        var email = $('#email').val().trim();
        if(email.length == 0){
            $('#mes').html("Enter your email");
            return;
        }

        $.ajax({
            url: '../server/php/forgot-pass.php',
            method: 'POST',
            data: JSON.stringify({email: email}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $('#mes').html("Verification mail sent");
                $("#confbtn").prop("disabled",true);
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