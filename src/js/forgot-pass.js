$(function(){

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
                $(":button#confbtn").prop("value", "Resend email");
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes').html(errormes);
            }
        });
    });
});