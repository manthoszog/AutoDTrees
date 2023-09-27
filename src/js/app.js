$(function(){
    $('#loadingbtn').hide();
    $('#loadingbtn2').hide();

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

    function getDatasets(){
    
        var link = '../server/php/api/get_datasets.php?token=' + token;

        $.ajax({
            url: link,
            method: 'GET',
            success: function(data){
                var data2 = JSON.parse(data);
                var publicDatasets = data2.public_data;
                var privateDatasets = data2.private_data;
                $("#select_dataset").html("");
                $("#select_dataset").append($("<option value='default' selected>Select from existing Datasets</option>"));
                for(var i = 0; i < publicDatasets.length; i++){
                    $("#select_dataset").append($(`<option class='public' value='${publicDatasets[i]}'>[PUBLIC]  ${publicDatasets[i]}</option>`));
                }
                for(var i = 0; i < privateDatasets.length; i++){
                    $("#select_dataset").append($(`<option class='private' value='${privateDatasets[i]}'>[PRIVATE]  ${privateDatasets[i]}</option>`));
                }
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                console.log(errormes);
                $("#select_dataset").html("");
                $("#select_dataset").append($("<option value='default' selected>Select from existing Datasets</option>"));
            }
        });
    }

    getDatasets();

    $("#upload_btn").click(function(){
        $('#upl_modal').modal('show');
        $('#alertPlaceholder').html("");
        $("#select_folder").val('0');
        $("#formFile").val("");
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

        var checkFile = /(\.csv|\.xls|\.xlsx)$/i;
        if(!checkFile.test(file.name)){
            alert_danger("Only csv, xls or xlsx files are supported.");
            return;
        }

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
                $("#loadingbtn").hide();
                $("#conf_upl").show();
                getDatasets();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                alert_danger(errormes);
                $("#formFile").val("");
                $("#select_folder").val('0');
                $("#loadingbtn").hide();
                $("#conf_upl").show();
            }
        });
    });

    $("#select_dataset").on("change",function(){
        var selected = $("#select_dataset :selected").val();

        if(selected == "default"){
            $('#delbtn').prop("disabled",true);
            $('#dnload-btn').prop("disabled",true);
            return;
        }

        $('#delbtn').prop("disabled",false);
        $('#dnload-btn').prop("disabled",false);
    });

    $('#delbtn').click(function(){
        var file = $("#select_dataset :selected").val();
        var folder = $("#select_dataset :selected").attr("class");

        $('#dnload-btn').prop("disabled",true);
        $('#delbtn').hide();
        $('#loadingbtn2').show();

        $.ajax({
            url: '../server/php/api/delete_dataset.php',
            method: 'DELETE',
            data: JSON.stringify({file: file, folder: folder, token: token}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $("#loadingbtn2").hide();
                $("#delbtn").show();
                $('#delbtn').prop("disabled",true);
                $("#select_dataset :selected").remove();
                $("#select_dataset").val("default");
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html("Selected Dataset deleted successfully.");
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $("#loadingbtn2").hide();
                $("#delbtn").show();
                $('#delbtn').prop("disabled",true);
                $("#select_dataset").val("default");
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
    });
});