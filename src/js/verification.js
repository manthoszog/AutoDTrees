$(function(){
    
    $('#btn').hide();
    $('#btn2').hide();

    function getUrlParams(k){
        var p={};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v});
        return k?p[k]:p;
    }
    var verif_key = getUrlParams('verif_key');
    var link = '../server/php/verification.php?verif_key=' + verif_key;
    var email;
    $.ajax({
        url: link,
        method: 'GET',
        success: function(){
            $('#mes').html("Successfully verified");
            sessionStorage.clear();
            $('#btn').show();
            $('#btn').text("Log in");
        },
        error: function(xhr,status,error){
            var response = JSON.parse(xhr.responseText);
            var errormes = response.errormesg;
            $('#mes').html(errormes);
            if(errormes == "Verification key expired."){
                email = response.email;
                $('#btn2').show();
                $('#btn2').text("Resend email");
            }
        }
    });

    $("#btn").click(function(){
        window.location.href='login.html';
    });
    
    $("#btn2").click(function(){
        var link = '../server/php/email_resend.php?email=' + email;
        $.ajax({
            url: link,
            method: 'GET',
            success: function(){
                $('#mes').html("Email successfully sent");
            },
            error: function(xhr,status,error){
                var response2 = JSON.parse(xhr.responseText);
                var errormes2 = response2.errormesg;
                $('#mes').html(errormes2);
            }
        });
    });
});