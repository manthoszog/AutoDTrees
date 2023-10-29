$(function(){
    /*$('#loadingbtn').hide();
    $('#loadingbtn2').hide();
    $('#loadingbtn3').hide();
    $('#table_div').hide();
    $('#params_div').hide();
    $('#results_div').hide();
    $('#loadingbtn_dataset').hide();
    $('#loadingbtnSave').hide();*/
    $('#loadingbtnModel').hide();

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

    /*var input_key = $("#params input");
    input_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#class_btn").css("display") !== "none"){
                $("#class_btn").click();
            }
        }
    });

    var input_key = $("#model_name");
    input_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#save_btn").css("display") !== "none"){
                $("#save_btn").click();
            }
        }
    });*/
    
    function getModels(){
    
        var link = '../server/php/api/get_models.php?token=' + token;

        $.ajax({
            url: link,
            method: 'GET',
            success: function(data){
                var data2 = JSON.parse(data);
                var models = data2.models_data;
                $("#select_model").html("");
                $("#select_model").append($("<option value='default' selected>Select a Pretrained Model</option>"));
                for(var i = 0; i < models.length; i++){
                    let m2 = models[i];
                    m2 = m2.substring(0, m2.length - 4);
                    $("#select_model").append($(`<option value='${models[i]}'>${m2}</option>`));
                }
                $('#del-model').prop("disabled",true);
                $('#dnload-model').prop("disabled",true);
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                console.log(errormes);
                $("#select_model").html("");
                $("#select_model").append($("<option value='default' selected>Select a Pretrained Model</option>"));
                $('#del-model').prop("disabled",true);
                $('#dnload-model').prop("disabled",true);
            }
        });
    }

    getModels();

    $("#select_model").on("change",function(){
        var selected = $("#select_model :selected").val();

        if(selected == "default"){
            $('#del-model').prop("disabled",true);
            $('#dnload-model').prop("disabled",true);
            return;
        }

        $('#del-model').prop("disabled",false);
        $('#dnload-model').prop("disabled",false);
    });

    $('#del-model').click(function(){
        var file = $("#select_model :selected").val();

        $('#del-model').prop("disabled",true);
        $('#del-model').hide();
        $('#loadingbtnModel').show();

        $.ajax({
            url: '../server/php/api/delete_model.php',
            method: 'DELETE',
            data: JSON.stringify({file: file, token: token}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $("#loadingbtnModel").hide();
                $("#del-model").show();
                $('#del-model').prop("disabled",true);
                $("#select_model :selected").remove();
                $("#select_model").val("default");
                $('#dnload-model').prop("disabled",true);
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html("Selected Model deleted successfully.");
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $("#loadingbtnModel").hide();
                $("#del-model").show();
                $('#del-model').prop("disabled",true);
                $("#select_model").val("default");
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
    });

    $('#dnload-model').click(function(event){
        var file = $("#select_model :selected").val();
        event.preventDefault();
        window.location.href = `../server/php/api/download_model.php?token=${token}&file=${file}`;
    });
    
    /*
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
    $("#checkBoxes").click(function(){
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

    $("#checkSelectAll").click(function(){
        var selAll = $("input[name=select_all]:checked");
        var check = $("input[name=num_field]");
        if(selAll.length > 0){
            for(var i = 0; i < check.length; i++){
                if(check[i].type == 'checkbox'){
                    check[i].checked = true;
                }
            }
            $("#checkBoxes").click();
        }
        else{
            for(var i = 0; i < check.length; i++){
                if(check[i].type == 'checkbox'){
                    check[i].checked = false;
                }
            }
            $("#checkBoxes").click();
        }
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
                            $(`#${tr_id}`).append($(`<td><div class="data_table_tbody_td">${val3}</div></td>`)); 
                        });
                    }
                });
                $('#loadingbtn_dataset').hide();
                $('#table_div').show();
                $('#checkSelectAll').html("");
                $('#checkSelectAll').append($(`
                    <input class="form-check-input edit_checkbox" type="checkbox" name="select_all" value="Select all" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                        Select all
                    </label>
                `));
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
                $("#max_depth").val("1");
                $("#min_samples_leaf").val("1");
                $("#kFolds").val("5");
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
        $("#kFolds:focus").blur();

        $("#model_name").val("my_model");
        
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
            $('#modal2_text').html("Please give the max_depth.");
            return;
        }

        var min_samples_leaf = $("#min_samples_leaf").val().trim();
        if(min_samples_leaf.length == 0){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give the min_samples_leaf.");
            return;
        }

        var kFolds = $("#kFolds").val().trim();
        if(kFolds.length == 0){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give the k value.");
            return;
        }

        var max_depthInt = Number.parseInt(max_depth);
        if(Number.isNaN(max_depthInt)){
	        $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a valid value for the max_depth.");
            return;
        }

        var min_samples_leafInt = Number.parseInt(min_samples_leaf);
        if(Number.isNaN(min_samples_leafInt)){
	        $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a valid value for the min_samples_leaf.");
            return;
        }

        var kFoldsInt = Number.parseInt(kFolds);
        if(Number.isNaN(kFoldsInt)){
	        $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a valid value for k.");
            return;
        }

        if(max_depthInt < 1){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You should give a max_depth &ge; 1.");
            return;
        }

        if(min_samples_leafInt < 1){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You should give a min_samples_leaf &ge; 1.");
            return;
        }

        if((kFoldsInt < 5) || (kFoldsInt > 50)){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Incorrect input for k. Range of accepted values: 5 - 50.");
            return;
        }

        var file = $("#select_dataset :selected").val();
        var folder = $("#select_dataset :selected").attr("class");

        $("#class_btn").hide();
        $("#loadingbtn3").show();

        $.ajax({
            url: '../server/php/api/cross_validation.php',
            method: 'POST',
            data: JSON.stringify({token: token, checkVal: checkVal, selected: selected, max_depthInt: max_depthInt, min_samples_leafInt: min_samples_leafInt, folder: folder, file: file, kFoldsInt: kFoldsInt}),
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                var avg_acc = data.avg_acc_score;
                var avg_prec = data.avg_prec_score;
                var avg_rec = data.avg_rec_score;
                var avg_f = data.avg_f_score;
                $("#titleName").html("");
                $("#titleName").append("Average Metrics for Class " + "'" + selected + "'");
                $("#results_tr").html("");
                $("#results_tr").append($(`<td>${avg_acc}</td>`));
                $("#results_tr").append($(`<td>${avg_prec}</td>`));
                $("#results_tr").append($(`<td>${avg_rec}</td>`));
                $("#results_tr").append($(`<td>${avg_f}</td>`));
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

    $("#save_btn").click(function(){        
        $("#model_name:focus").blur();
        
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
            $('#modal2_text').html("Please give the max_depth.");
            return;
        }

        var min_samples_leaf = $("#min_samples_leaf").val().trim();
        if(min_samples_leaf.length == 0){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give the min_samples_leaf.");
            return;
        }

        var model_name = $("#model_name").val().trim();
        if(model_name.length == 0){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a name for your Model.");
            return;
        }

        var max_depthInt = Number.parseInt(max_depth);
        if(Number.isNaN(max_depthInt)){
	        $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a valid value for the max_depth.");
            return;
        }

        var min_samples_leafInt = Number.parseInt(min_samples_leaf);
        if(Number.isNaN(min_samples_leafInt)){
	        $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("Please give a valid value for the min_samples_leaf.");
            return;
        }

        if(max_depthInt < 1){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You should give a max_depth &ge; 1.");
            return;
        }

        if(min_samples_leafInt < 1){
            $('#modal2_text').html("");
            $('#modal2').modal('show');
            $('#modal2_text').html("You should give a min_samples_leaf &ge; 1.");
            return;
        }

        var file = $("#select_dataset :selected").val();
        var folder = $("#select_dataset :selected").attr("class");

        $("#save_btn").hide();
        $("#loadingbtnSave").show();

        $.ajax({
            url: '../server/php/api/save_model.php',
            method: 'POST',
            data: JSON.stringify({token: token, checkVal: checkVal, selected: selected, max_depthInt: max_depthInt, min_samples_leafInt: min_samples_leafInt, folder: folder, file: file, model_name: model_name}),
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                var mes = data.message;
                $("#loadingbtnSave").hide();
                $("#save_btn").show();
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(mes);
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $("#loadingbtnSave").hide();
                $("#save_btn").show();
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
    });

    $("#data_table").click(function(event){
        $(".selectedRow").removeClass("selectedRow");
        $(event.target).closest("tr").addClass("selectedRow");
    });*/
});