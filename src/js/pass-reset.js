$(function(){
    
    function getUrlParams(k){
        var p={};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v});
        return k?p[k]:p;
    }
    var verif_key = getUrlParams('verif_key');

    $('#confbtn').click(function(){
        var pass = $('#pass').val().trim();
        var pass_confirm = $('#pass_confirm').val().trim();

        if(pass.length == 0){
            $('#mes').html("Enter new password");
            return;
        }

        if(pass_confirm.length == 0){
            $('#mes').html("Confirm new password");
            return;
        }

        $.ajax({
            url: '../server/php/pass-reset.php',
            method: 'POST',
            data: JSON.stringify({verif_key: verif_key, pass: pass, pass_confirm: pass_confirm}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $('#mes').html("Password successfully updated.");
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#mes').html(errormes);
            }
        });
    });
});