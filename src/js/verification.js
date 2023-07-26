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
            var errormesg = response.errormesg;
            var showError = '<div>' + errormesg + '</div>';
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
                        success: function(){
                            var showSuccess2 = '<div>Email successfully sent</div>';
                            $('#mes').html(showSuccess2);
                        },
                        error: function(xhr2,status2,error2){
                            var response2 = JSON.parse(xhr2.responseText);
                            var errormesg2 = response2.errormesg;
                            var showError2 = '<div>' + errormesg2 + '</div>';
                            $('#mes').html(showError2);
                            if(errormesg2 == 'Maximum limit of verification resending has exceeded. Please register again.'){
                                $('#btn2').show();
                                $('#btn2').text("Register");
                                $("#btn2").click(function(){
                                    window.location.href='register.html';
                                });
                            }
                        }
                    });
                });
                $('#btn').hide();
                $('#btn2').hide();
            }
        }
    });
});