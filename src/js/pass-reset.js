$(function(){
    $('#loadingbtn').hide();
    $('#loginbtn').hide();
    $('#retry').hide();

    const alertPlaceholder = $('#alertPlaceholder');

    const alert_danger = (message) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-danger d-flex align-items-center" role="alert">`,
            `   <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-x-octagon-fill alert-icon alert-danger-color" viewBox="0 0 16 16"><path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/></svg> <div class="alert-text">${message}</div>`,
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    }

    const alert_success = (message) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            '<div class="alert alert-success d-flex align-items-center" role="alert">', 
            '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-check-circle-fill alert-icon" viewBox="0 0 16 16">',
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>',
            `</svg> <div class="alert-text">${message}</div>`,
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    }

    var input_key = $("input");
    input_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#confbtn").css("display") !== "none"){
                $("#confbtn").click();
            }
        }
    });

    function getUrlParams(k){
        var p={};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v});
        return k?p[k]:p;
    }
    var verif_key = getUrlParams('verif_key');

    $('#confbtn').click(function(){
        $('#alertPlaceholder').html("");
        var pass = $('#pass').val().trim();
        var pass_confirm = $('#pass_confirm').val().trim();

        if(pass.length == 0){
            alert_danger("Enter new password");
            return;
        }

        if(pass_confirm.length == 0){
            alert_danger("Confirm new password");
            return;
        }

        $('#alertPlaceholder').html("");
        $('#confbtn').hide();
        $('#loadingbtn').show();

        $.ajax({
            url: '../server/php/pass-reset.php',
            method: 'POST',
            data: JSON.stringify({verif_key: verif_key, pass: pass, pass_confirm: pass_confirm}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                alert_success("Password successfully updated.");
                $('#loadingbtn').hide();
                $('#loginbtn').show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                alert_danger(errormes);
                $('#loadingbtn').hide();
                if(errormes == "Verification key expired."){
                    $('#retry').show();
                }
                else{
                    $('#confbtn').show();
                }
            }
        });
    });

    $("#loginbtn").click(function(){
        window.location.href='login.html';
    });

    $("#retry").click(function(){
        window.location.href='forgot-pass.html';
    });
});