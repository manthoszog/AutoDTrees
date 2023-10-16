$(function(){
    $('#loadingbtn').hide();
    $('#loadingbtn2').hide();
    $('#loadingbtn3').hide();
    $('#table_div').hide();
    $('#params_div').hide();
    $('#results_div').hide();
    $('#loadingbtn_dataset').hide();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
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
        $("#username").html($(`<i class="bi bi-person-circle"></i><span style="margin-left: 10px;">${sessionStorage.getItem("fname")} ${sessionStorage.getItem("lname")}</span>`));
    }
    else{
        window.location.href = 'login.html';
    }

    var token = sessionStorage.getItem("token");

    $("#logoutb").click(function(){
        sessionStorage.clear();
        window.location.href = '../';
    });

    var modal_key = $("#modal2");
    modal_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#modal2").css("display") !== "none"){
                $("#modal_btn").click();
            }
        }
    });

    var input_key = $("input");
    input_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#class_btn").css("display") !== "none"){
                $("#class_btn").click();
            }
        }
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
                $('#delbtn').prop("disabled",true);
                $('#dnload-btn').prop("disabled",true);
                $('#table_div').hide();
                $('#params_div').hide();
                $('#results_div').hide();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                console.log(errormes);
                $("#select_dataset").html("");
                $("#select_dataset").append($("<option value='default' selected>Select from existing Datasets</option>"));
                $('#delbtn').prop("disabled",true);
                $('#dnload-btn').prop("disabled",true);
                $('#table_div').hide();
                $('#params_div').hide();
                $('#results_div').hide();
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

        var checkFile = /(\.csv)$/i;
        if(!checkFile.test(file.name)){
            alert_danger("Only .csv files are supported.");
            return;
        }

        if(file.size > 41943040){
            alert_danger("Max file size is 40 MB.");
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

    let fields2;
    $("#checkBoxes").on("change",function(){
        const fields22 = {};
        for(var i = 0; i < fields2.length; i++){
            fields22[i] = fields2[i];
        }
        let fields3 = fields22;
        var check = $("input[name=num_field]:checked");
        $.each(check,function(index4){
            var checkVal = $(this).val();
            $.each(fields3,function(index5,val5){
                if(checkVal == fields3[index5]){
                    fields3[index5] = '';
                }
            });
        });
        $("#select_class").html("");
        $("#select_class").append($("<option value='default' selected>Select Class column</option>"));
        $.each(fields3,function(index6,val6){
            if(fields3[index6] !== ''){
                $("#select_class").append($(`<option value='${fields3[index6]}'>${fields3[index6]}</option>`));
            }
        });
    });
    
    $("#select_dataset").on("change",function(){
        $('#table_div').hide();
        $('#params_div').hide();
        $('#results_div').hide();

        var selected = $("#select_dataset :selected").val();
        var folder = $("#select_dataset :selected").attr("class");

        if(selected == "default"){
            $('#delbtn').prop("disabled",true);
            $('#dnload-btn').prop("disabled",true);
            return;
        }

        $('#delbtn').prop("disabled",false);
        $('#dnload-btn').prop("disabled",false);

        $('#loadingbtn_dataset').show();
        
        $.ajax({
            url: `../server/php/api/get_dataset_content.php?token=${token}&file=${selected}&folder=${folder}`,
            method: 'GET',
            success: function(data){
                var data2 = JSON.parse(data);
                var csv_array = data2.csv_array;
                var num_fields = data2.numerical_fields;
                var fields1 = data2.fields;
                fields2 = data2.fields;
                $("#data_table_head_tr").html("");
                $("#data_table_tbody").html("");
                $.each(csv_array[0], function(index,val){
                    $("#data_table_head_tr").append($(`<th scope="col">${val}</th>`));
                });
                $.each(csv_array, function(index2,val2){
                    if(index2 > 0){
                        var tr_id = 'tr' + index2;
                        $("#data_table_tbody").append($(`<tr id="${tr_id}"></tr>`));
                        $.each(csv_array[index2], function(index3,val3){
                            $(`#${tr_id}`).append($(`<td>${val3}</td>`)); 
                        });
                    }
                });
                $('#loadingbtn_dataset').hide();
                $('#table_div').show();
                $('#checkBoxes').html("");
                for(var i = 0; i < num_fields.length; i++){
                    $('#checkBoxes').append($(`
                        <div class="form-check form-check-inline">
                            <input class="form-check-input edit_checkbox" type="checkbox" name="num_field" value="${num_fields[i]}" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                ${num_fields[i]}
                            </label>
                        </div>
                    `));
                }
                $("#select_class").html("");
                $("#select_class").append($("<option value='default' selected>Select Class column</option>"));
                for(var i = 0; i < fields1.length; i++){
                    $("#select_class").append($(`<option value='${fields1[i]}'>${fields1[i]}</option>`));
                }
                $("#max_depth").val("");
                $("#min_samples_leaf").val("");
                $('#params_div').show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#loadingbtn_dataset').hide();
                $('#dnload-btn').prop("disabled",true);
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
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
                $('#table_div').hide();
                $('#params_div').hide();
                $('#results_div').hide();
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
                $('#table_div').hide();
                $('#params_div').hide();
                $('#results_div').hide();
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
    });

    $('#dnload-btn').click(function(event){
        var file = $("#select_dataset :selected").val();
        var folder = $("#select_dataset :selected").attr("class");
        var link = '../server/php/api/download_dataset.php?token=' + token + '&folder=' + folder + '&file=' + file;
        event.preventDefault();
        window.location.href = link;
    });

    $("#class_btn").click(function(){
        $('#results_div').hide();
        
        $("#max_depth:focus").blur();
        $("#min_samples_leaf:focus").blur();
        
        var check = $("input[name=num_field]:checked");
        if(check.length == 0){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You didn't select any numerical columns.");
            return;
        }

        var selected = $("#select_class :selected").val();
        if(selected == 'default'){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You have to select a Class column.");
            return;
        }

        var checkVal = {};
        $.each(check,function(i){
            checkVal[i] = $(this).val();
        });

        var max_depth = $("#max_depth").val().trim();
        if(max_depth.length == 0){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give the Max Depth.");
            return;
        }

        var min_samples_leaf = $("#min_samples_leaf").val().trim();
        if(min_samples_leaf.length == 0){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give the Min samples/leaf.");
            return;
        }

        var max_depthInt = Number.parseInt(max_depth);
        if(Number.isNaN(max_depthInt)){
	        $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a valid value for the Max Depth.");
            return;
        }

        var min_samples_leafInt = Number.parseInt(min_samples_leaf);
        if(Number.isNaN(min_samples_leafInt)){
	        $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a valid value for the Min samples/leaf.");
            return;
        }

        if(max_depthInt < 1){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You should give a Max Depth&ge;1.");
            return;
        }

        if(min_samples_leafInt < 1){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You should give a Min samples/leaf&ge;1.");
            return;
        }

        var file = $("#select_dataset :selected").val();
        var folder = $("#select_dataset :selected").attr("class");

        $("#class_btn").hide();
        $("#loadingbtn3").show();

        $.ajax({
            url: '../server/php/api/cross_validation.php',
            method: 'POST',
            data: JSON.stringify({token: token, checkVal: checkVal, selected: selected, max_depthInt: max_depthInt, min_samples_leafInt: min_samples_leafInt, folder: folder, file: file}),
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                var kfold_acc = data.kfold_acc_score;
                var avg_acc = data.avg_acc_score;
                $("#results_tr").html("");
                for(var i = 0; i < kfold_acc.length; i++){
                    $("#results_tr").append($(`<td>${kfold_acc[i]}</td>`));
                }
                $("#results_tr").append($(`<td>${avg_acc}</td>`));
                $("#loadingbtn3").hide();
                $("#class_btn").show();
                $('#results_div').show();
                window.location.href = '#results_div';
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $("#loadingbtn3").hide();
                $("#class_btn").show();
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
    });
});