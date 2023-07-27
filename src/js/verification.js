$(function(){
    
    $('#btn').hide();
    $('#btn2').hide();
    $('#btn3').hide();

    function getUrlParams(k){
        var p={};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v});
        return k?p[k]:p;
    }
    var verif_key = getUrlParams('verif_key');
    var link = '../server/php/verification.php?verif_key=' + verif_key;
    var id;
    $.ajax({
        url: link,
        method: 'GET',
        success: function(){
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
            var errormes = response.errormesg;
            $('#mes').html(errormes);
            if(errormes == "Verification key expired."){
                id = response.id;
                $('#btn2').show();
                $('#btn2').text("Resend email");
            }
        }
    });

    $("#btn2").click(function(){
        $.ajax({
            url: '../server/php/email_resend.php',
            method: 'POST',
            data: JSON.stringify({id: id}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $('#mes').html("Email successfully sent");
                $("#btn2").prop("disabled",true);
            },
            error: function(xhr,status,error){
                var response2 = JSON.parse(xhr.responseText);
                var errormesg2 = response2.errormesg;
                $('#mes').html(errormesg2);
                if(errormesg2 == "Maximum limit of verification resending has exceeded. Please register again."){
                    $("#btn2").prop("disabled",true);
                    $('#btn3').show();
                    $('#btn3').text("Register");
                }
            }
        });
    });
    $("#btn3").click(function(){
        window.location.href='register.html';
    });
});