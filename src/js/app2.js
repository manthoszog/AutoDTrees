$(function(){
    $('#loadingbtn3').hide();
    $('#loadingbtn2').hide();
    $('#params_div2').hide();
    $('#loadingbtnModel').hide();
    $('#loadingbtnModel2').hide();
    $('#loadingbtn').hide();
    $('#loadingbtn_dataset').hide();
    $('#loadingbtnTree').hide();
    $('#uplDiv').hide();
    $('#table_div').hide();
    //$('#params_div').hide();
    $('#results_div').hide();
    
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

    var modal_key = $("#modal2");
    modal_key.on("keypress", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if($("#modal2").css("display") !== "none"){
                $("#modal_btn").click();
            }
        }
    });
    
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
                $('#visualizeTree').prop("disabled",true);
                $('#params_div2').hide();
                $('#uplDiv').hide();
                $('#table_div').hide();
                //$('#params_div').hide();
                $('#results_div').hide();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                console.log(errormes);
                $("#select_model").html("");
                $("#select_model").append($("<option value='default' selected>Select a Pretrained Model</option>"));
                $('#del-model').prop("disabled",true);
                $('#dnload-model').prop("disabled",true);
                $('#visualizeTree').prop("disabled",true);
                $('#params_div2').hide();
                $('#uplDiv').hide();
                $('#table_div').hide();
                //$('#params_div').hide();
                $('#results_div').hide();
            }
        });
    }

    getModels();

    $("#select_model").on("change",function(){
        $('#params_div2').hide();
        $('#uplDiv').hide();
        $('#table_div').hide();
        //$('#params_div').hide();
        $('#results_div').hide();
        var selected = $("#select_model :selected").val();

        if(selected == "default"){
            $('#del-model').prop("disabled",true);
            $('#dnload-model').prop("disabled",true);
            $('#visualizeTree').prop("disabled",true);
            return;
        }

        $('#del-model').prop("disabled",false);
        $('#dnload-model').prop("disabled",false);
        $('#visualizeTree').prop("disabled",false);
        $('#loadingbtnModel2').show();

        $.ajax({
            url: `../server/php/api/get_model_content.php?token=${token}&file=${selected}`,
            method: 'GET',
            success: function(data){
                let d = JSON.parse(data);
                let cols = d.columns;
                $('#checkBoxes2').html("");
                for(var i = 0; i < cols.length; i++){
                    $('#checkBoxes2').append($(`
                        <div class="form-check form-check-inline">
                            <input class="form-check-input edit_checkbox" type="checkbox" id="flexCheckDefault2" name="num_field" value="${cols[i]}" checked disabled>
                            <label class="form-check-label" for="flexCheckDefault2">
                                ${cols[i]}
                            </label>
                        </div>
                    `));
                }
                $('#loadingbtnModel2').hide();
                $('#params_div2').show();
                getDatasets();
                $('#uplDiv').show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#dnload-model').prop("disabled",true);
                $('#visualizeTree').prop("disabled",true);
                $('#loadingbtnModel2').hide();
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
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
                $('#visualizeTree').prop("disabled",true);
                $('#params_div2').hide();
                $('#uplDiv').hide();
                $('#table_div').hide();
                //$('#params_div').hide();
                $('#results_div').hide();
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
                $('#dnload-model').prop("disabled",true);
                $('#visualizeTree').prop("disabled",true);
                $('#params_div2').hide();
                $('#uplDiv').hide();
                $('#table_div').hide();
                //$('#params_div').hide();
                $('#results_div').hide();
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

    $('#visualizeTree').click(function(){
        var file = $("#select_model :selected").val();
        $('#tree_modalBody').html("");
        $('#visualizeTree').hide();
        $('#loadingbtnTree').show();
        
        $.ajax({
            url: `../server/php/api/visualize_tree.php?token=${token}&file=${file}`,
            method: 'GET',
            success: function(data){
                var data2 = JSON.parse(data);
                var image = data2.image;
                $('#tree_modalBody').append($(`
                    <img class="img-fluid mx-auto d-block" style="max-height: 75vh;" src="${image}" alt="Tree Visualization">
                `));
                $('#tree_modal').modal('show');
                $('#loadingbtnTree').hide();
                $('#visualizeTree').show();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#loadingbtnTree').hide();
                $('#visualizeTree').show();
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
    });
    
    $('#dnloadTree').click(function(event){
        var file = $("#select_model :selected").val();
        event.preventDefault();
        window.location.href = `../server/php/api/download_tree.php?token=${token}&file=${file}`;
    });
    
    function getDatasets(){
    
        $.ajax({
            url: `../server/php/api/get_unclassified_datasets.php?token=${token}`,
            method: 'GET',
            success: function(data){
                var data2 = JSON.parse(data);
                var datasets = data2.unclassified_data;
                $("#select_dataset").html("");
                $("#select_dataset").append($("<option value='default' selected>Select an Unclassified Dataset</option>"));
                for(var i = 0; i < datasets.length; i++){
                    $("#select_dataset").append($(`<option value='${datasets[i]}'>[UNCLASSIFIED]  ${datasets[i]}</option>`));
                }
                $('#delbtn').prop("disabled",true);
                $('#dnload-btn').prop("disabled",true);
                $('#table_div').hide();
                //$('#params_div').hide();
                $('#results_div').hide();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
                $("#select_dataset").html("");
                $("#select_dataset").append($("<option value='default' selected>Select an Unclassified Dataset</option>"));
                $('#delbtn').prop("disabled",true);
                $('#dnload-btn').prop("disabled",true);
                $('#table_div').hide();
                //$('#params_div').hide();
                $('#results_div').hide();
            }
        });
    }
    
    $("#upload_btn").click(function(){
        $('#upl_modal').modal('show');
        $('#alertPlaceholder').html("");
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

        var formData = new FormData();
        formData.set("token", token);
        formData.set("file", file);
        
        $('#alertPlaceholder').html("");
        $("#conf_upl").hide();
        $('#loadingbtn').show();

        $.ajax({
            url: '../server/php/api/upload_unclassified_dataset.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(){
                alert_success("File uploaded successfully.");
                $("#formFile").val("");
                $("#loadingbtn").hide();
                $("#conf_upl").show();
                getDatasets();
            },
            error: function(xhr,status,error){
                var response = JSON.parse(xhr.responseText);
                var errormes = response.errormesg;
                alert_danger(errormes);
                $("#formFile").val("");
                $("#loadingbtn").hide();
                $("#conf_upl").show();
            }
        });
    });
    
    $("#select_dataset").on("change",function(){
        $('#table_div').hide();
        //$('#params_div').hide();
        $('#results_div').hide();

        var selected = $("#select_dataset :selected").val();

        if(selected == "default"){
            $('#delbtn').prop("disabled",true);
            $('#dnload-btn').prop("disabled",true);
            return;
        }

        $('#delbtn').prop("disabled",false);
        $('#dnload-btn').prop("disabled",false);

        $('#loadingbtn_dataset').show();
        
        $.ajax({
            url: `../server/php/api/get_unclassified_dataset_content.php?token=${token}&file=${selected}`,
            method: 'GET',
            success: function(data){
                var data2 = JSON.parse(data);
                var csv_array = data2.csv_array;
                //var num_fields = data2.numerical_fields;
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
                window.location.href = "#checkBoxes2";
                // $('#checkSelectAll').html("");
                // $('#checkSelectAll').append($(`
                //     <input class="form-check-input edit_checkbox" type="checkbox" name="select_all" value="Select all" id="flexCheckDefault">
                //     <label class="form-check-label" for="flexCheckDefault">
                //         Select all
                //     </label>
                // `));
                // $('#checkBoxes').html("");
                // for(var i = 0; i < num_fields.length; i++){
                //     $('#checkBoxes').append($(`
                //         <div class="form-check form-check-inline">
                //             <input class="form-check-input edit_checkbox" type="checkbox" name="num_field" value="${num_fields[i]}" id="flexCheckDefault">
                //             <label class="form-check-label" for="flexCheckDefault">
                //                 ${num_fields[i]}
                //             </label>
                //         </div>
                //     `));
                // }
                //$('#params_div').show();
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

        $('#dnload-btn').prop("disabled",true);
        $('#delbtn').hide();
        $('#loadingbtn2').show();

        $.ajax({
            url: '../server/php/api/delete_unclassified_dataset.php',
            method: 'DELETE',
            data: JSON.stringify({file: file, token: token}),
            dataType: "json",
            contentType: 'application/json',
            success: function(){
                $("#loadingbtn2").hide();
                $("#delbtn").show();
                $('#delbtn').prop("disabled",true);
                $("#select_dataset :selected").remove();
                $("#select_dataset").val("default");
                $('#table_div').hide();
                //$('#params_div').hide();
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
                //$('#params_div').hide();
                $('#results_div').hide();
                $('#modal2_text').html("");
                $('#modal2').modal('show');
                $('#modal2_text').html(errormes);
            }
        });
    });

    $('#dnload-btn').click(function(event){
        var file = $("#select_dataset :selected").val();
        event.preventDefault();
        window.location.href = `../server/php/api/download_unclassified_dataset.php?token=${token}&file=${file}`;
    });

    // $("#checkSelectAll").click(function(){
    //     var selAll = $("input[name=select_all]:checked");
    //     var check = $("input[name=num_field]");
    //     if(selAll.length > 0){
    //         for(var i = 0; i < check.length; i++){
    //             if(check[i].type == 'checkbox'){
    //                 check[i].checked = true;
    //             }
    //         }
    //     }
    //     else{
    //         for(var i = 0; i < check.length; i++){
    //             if(check[i].type == 'checkbox'){
    //                 check[i].checked = false;
    //             }
    //         }
    //     }
    // });

    $("#data_table").click(function(event){
        $(".selectedRow").removeClass("selectedRow");
        $(event.target).closest("tr").addClass("selectedRow");
    });

    $("#class_btn").click(function(){
        $('#results_div').hide();
        
        var check = $("input[name=num_field]:checked");
        // if(check.length == 0){
        //     $('#modal2_text').html("");
        //     $('#modal2').modal('show');
        //     $('#modal2_text').html("You didn't select any numerical columns.");
        //     return;
        // }

        var checkVal = {};
        $.each(check,function(i){
            checkVal[i] = $(this).val();
        });

        var file = $("#select_dataset :selected").val();
        var model = $("#select_model :selected").val();

        $("#class_btn").hide();
        $("#loadingbtn3").show();

        $.ajax({
            url: '../server/php/api/classifyData.php',
            method: 'POST',
            data: JSON.stringify({token: token, checkVal: checkVal, file: file, model: model}),
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                var csv_array = data.dataset;
                $("#data_table2_head_tr").html("");
                $("#data_table2_tbody").html("");
                $.each(csv_array[0], function(index,val){
                    $("#data_table2_head_tr").append($(`<th scope="col">${val}</th>`));
                });
                $.each(csv_array, function(index2,val2){
                    if(index2 > 0){
                        var tr2_id = 'tr2' + index2;
                        $("#data_table2_tbody").append($(`<tr id="${tr2_id}"></tr>`));
                        $.each(csv_array[index2], function(index3,val3){
                            $(`#${tr2_id}`).append($(`<td><div class="data_table_tbody_td">${val3}</div></td>`)); 
                        });
                    }
                });
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

    $("#data_table2").click(function(event){
        $(".selectedRow2").removeClass("selectedRow2");
        $(event.target).closest("tr").addClass("selectedRow2");
    });

    $('#save_btn').click(function(event){
        var file = $("#select_dataset :selected").val();
        event.preventDefault();
        window.location.href = `../server/php/api/download_classified_dataset.php?token=${token}&file=${file}`;
    });
});