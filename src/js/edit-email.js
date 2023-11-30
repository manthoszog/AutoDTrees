$(function(){
    $('#loadingbtn').hide();
    $('#email_resend').hide();
    $("#loginb").hide();

    const alertPlaceholder = $('#alertPlaceholder');

    const alert_danger = (message) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-danger d-flex align-items-center alert-dismissible" role="alert">`,
            `   <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-x-octagon-fill alert-icon alert-danger-color" viewBox="0 0 16 16"><path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/></svg> <div class="alert-text">${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    }

    const alert_success = (message) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            '<div class="alert alert-success d-flex align-items-center alert-dismissible" role="alert">', 
            '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-check-circle-fill alert-icon" viewBox="0 0 16 16">',
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>',
            `</svg> <div class="alert-text">${message}</div>`,
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    }

    const alert_warning = (message) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            '<div class="alert alert-warning d-flex align-items-center alert-dismissible" role="alert">', 
            '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-octagon-fill alert-icon" viewBox="0 0 16 16">',
                '<path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>',
              `</svg> <div class="alert-text">${message}</div>`,
              '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    }

    var input_key = $("input");
    input_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#confbtn2").css("display") !== "none"){
                $("#confbtn2").click();
            }
            else if($("#email_resend").css("display") !== "none"){
                $("#email_resend").click();
            }
        }
    });

    if(sessionStorage.getItem("token") !== null){
        $("#username").html($(`
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
        <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
        <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/>
        </svg><span style="margin-left: 10px;">${sessionStorage.getItem("fname")} ${sessionStorage.getItem("lname")}</span>`));
    }
    else{
        window.location.href = 'login.html';
    }

    var token = sessionStorage.getItem("token");

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = '../';
    });

    $('#drop_width').click(function(event){
        event.stopPropagation();
    });

    var email;
    $('#confbtn2').click(function(){ 
        $('#alertPlaceholder').html("");
        email = $('#email').val().trim();
        if(email.length == 0){
            alert_danger("Enter your new email address");
            return;
        }

        if(email == sessionStorage.getItem("email")){
            alert_danger("Enter a different email from the existing.");
            return;
        }

        $('#alertPlaceholder').html("");
        $('#confbtn2').hide();
        $('#loadingbtn').show();

        $.ajax({
            url: '../server/php/api/edit-account.php',
            method: 'POST',
            data: JSON.stringify({email: email, token: token}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                sessionStorage.setItem("email", email);
                alert_success("Email updated successfully.");
                alert_warning("Check inbox for verification instructions.");
                $('#loadingbtn').hide();
                $("#email_resend").show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                alert_danger(errormes);
                $('#loadingbtn').hide();
                if(errormes == "Mailer Error. Message could not be sent."){
                    $("#email_resend").show();
                }
                else{
                    $("#confbtn2").show();
                }
            }
        });        
    });

    $('#email_resend').click(function(){
        $('#alertPlaceholder').html("");
        var link = '../server/php/email_resend.php?email=' + email;

        $('#email_resend').hide();
        $('#loadingbtn').show();

        $.ajax({
            url: link,
            method: 'GET',
            success: function(){
                alert_success("Verification mail successfully sent");
                alert_warning("Check inbox for verification instructions.");
                $('#loadingbtn').hide();
                $("#email_resend").show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                alert_danger(errormes);
                $('#loadingbtn').hide();
                if(errormes == "Account already verified."){
                    alert_warning("Please log in again");
                    sessionStorage.clear();
                    $("#loginb").show();
                }
                else{
                    $('#email_resend').show();
                }
            }
        });
    });

    $("#loginb").click(function(){
        window.location.href = 'login.html';
    });    
});