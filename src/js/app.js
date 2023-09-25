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

    if(sessionStorage.getItem("token") !== null){
        $("#username").text(sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname"));
    }
    else{
        window.location.href = 'login.html';
    }

    var token = sessionStorage.getItem("token");

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = '../';
    });

    $("#upload_btn").click(function(){
        $('#upl_modal').modal('show');
        $('#alertPlaceholder').html("");
        $("#select_folder").val('0');
    });

    $('#cancelbtn').click(function(){
        $('#alertPlaceholder').html("");
    });

    $('#conf_upl').click(function(){
        $('#alertPlaceholder').html("");

        if($("#formFile").prop('files').length == 0){
            alert_danger("Please upload dataset.");
            return;
        }

        var file = $("#formFile").prop('files')[0];
        var folder = $("#select_folder :selected").val();

        if(folder == "Select folder to save"){
            alert_danger("Please select folder to save.");
            return;
        }

        switch(folder){
            case "Private folder":
                folder = "private";
                break;
            case "Public folder":
                folder = "public";
                break;
        }

        var formData = new FormData();
        formData.set("token", token);
        formData.set("folder", folder);
        formData.set("file", file);
        
        $('#alertPlaceholder').html("");
        $("#conf_upl").hide();
        $('#loadingbtn').show();

        $.ajax({
            url: '../server/php/api/upload_dataset.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(){
                alert_success("File uploaded successfully.");
                $("#formFile").val("");
                $("#select_folder").val('0');
                //$("#select_folder option[value=0]").attr('selected', 'selected');
                $("#loadingbtn").hide();
                $("#conf_upl").show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                alert_danger(errormes);
                $("#formFile").val("");
                $("#select_folder").val('0');
                //$("#select_folder option[value=0]").attr('selected', 'selected');
                $("#loadingbtn").hide();
                $("#conf_upl").show();
            }
        });
    });
});