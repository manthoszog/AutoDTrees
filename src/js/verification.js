$(function(){
    
    const urlParams = new URLSearchParams(window.location.search);
    const verif_key = urlParams.get('verif_key');

    $.ajax({
        url: '../server/php/verification.php',
        method: 'GET',
        data: JSON.stringify({verif_key: verif_key}),
        dataType: "json",
        contentType: 'application/json',
        success: function(data){
            //show message
        },
        error: function(xhr,status,error){
            //show message
        }
    });
});