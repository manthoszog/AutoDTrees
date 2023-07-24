$(function(){
    
    $('#btn').hide();

    const urlParams = new URLSearchParams(window.location.search);
    const verif_key = urlParams.get('verif_key');

    $.ajax({
        url: '../server/php/verification.php',
        method: 'GET',
        data: JSON.stringify({verif_key: verif_key}),
        dataType: "json",
        contentType: 'application/json',
        success: function(data){
            var showSuccess = '<div>Successfully registered</div>';
            $('#mes').append(showSuccess);
            $('#btn').show();
            $('#btn').text("Log in");
            $("#btn").click(function(){
                window.location.href='login.html';
            });
        },
        error: function(xhr,status,error){
            var response = JSON.parse(xhr.responseText);
            var errormesg = response.errormesg;
            var showError = '<div>${errormesg}</div>';
            $('#mes').append(showError);
            if(errormesg == 'Verification key expired'){
                var id = response.id;
                $('#btn').show();
                $('#btn').text("Resend email");
                $("#btn").click(function(){
                    $.ajax({
                        url: '../server/php/email_resend.php',
                        method: 'POST',
                        data: JSON.stringify({id: id}),
                        dataType: "json",
                        contentType: 'application/json',
                        success: function(data){
                            var showSuccess2 = '<div>Email successfully sent</div>';
                            $('#mes').append(showSuccess2);
                            $('#btn').hide();
                        },
                        error: function(xhr2,status2,error2){
                            var response2 = JSON.parse(xhr2.responseText);
                            var errormesg2 = response2.errormesg;
                            var showError2 = '<div>${errormesg2}</div>';
                            $('#mes').append(showError2);
                            $('#btn').hide();
                        }
                    });
                });
            }
        }
    });
});