$(function(){
    $('#loadingbtn').hide();

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

    var input_key = $("input");
    input_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#confbtn1").css("display") !== "none"){
                $("#confbtn1").click();
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

    $('#confbtn1').click(function(){
        $('#alertPlaceholder').html("");
        var fname = $('#fname').val().trim();
        var lname = $('#lname').val().trim();
        var pass = $('#pass').val().trim();
        var new_pass = $('#new_pass').val().trim();
        var new_pass_confirm = $('#new_pass_confirm').val().trim();

        if((fname.length == 0) && (lname.length == 0) && (pass.length == 0) && (new_pass.length == 0) && (new_pass_confirm.length == 0)){
            alert_danger("You should edit at least one field.");
            return;
        }

        var edited_fields = {};

        if(fname.length > 0){
            if(fname == sessionStorage.getItem("fname")){
                alert_danger("Enter a different first name from the existing.");
                return;
            }
            else{
                edited_fields.fname = fname;
            }
        }

        if(lname.length > 0){
            if(lname == sessionStorage.getItem("lname")){
                alert_danger("Enter a different last name from the existing.");
                return;
            }
            else{
                edited_fields.lname = lname;
            }
        }

        if((pass.length > 0) && (new_pass.length == 0)){
            alert_danger("Please enter new password.");
            return;
        }

        if((pass.length == 0) && (new_pass.length > 0)){
            alert_danger("Please enter current password.");
            return;
        }

        if((pass.length > 0) && (new_pass.length > 0) && (new_pass_confirm.length == 0)){
            alert_danger("Please confirm your new password.");
            return;
        }

        if((new_pass_confirm.length > 0) && ((pass.length == 0) || (new_pass.length == 0))){
            alert_danger("Please fill all password related fields.");
            return;
        }

        if((pass.length > 0) && (new_pass.length > 0) && (new_pass_confirm.length > 0)){
            edited_fields.pass = pass;
            edited_fields.new_pass = new_pass;
            edited_fields.new_pass_confirm = new_pass_confirm;
        }

        edited_fields.token = token;

        $('#alertPlaceholder').html("");
        $('#confbtn1').hide();
        $('#loadingbtn').show();

        $.ajax({
            url: '../server/php/api/edit-account.php',
            method: 'POST',
            data: JSON.stringify(edited_fields),
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                if(data.fname !== null){
                    sessionStorage.setItem("fname", data.fname);
                }
                if(data.lname !== null){
                    sessionStorage.setItem("lname", data.lname);
                }
                $("#username").html("");
                $("#username").html($(`
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/>
                </svg><span style="margin-left: 10px;">${sessionStorage.getItem("fname")} ${sessionStorage.getItem("lname")}</span>`));
                $('#fname').val("");
                $('#lname').val("");
                $('#pass').val("");
                $('#new_pass').val("");
                $('#new_pass_confirm').val("");
                alert_success("Changes saved successfully");
                $('#loadingbtn').hide();
                $("#confbtn1").show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                alert_danger(errormes);
                $('#loadingbtn').hide();
                $("#confbtn1").show();
            }
        });
    });
});