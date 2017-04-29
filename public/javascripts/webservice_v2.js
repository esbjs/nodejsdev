

function EnviarGet(path, callback, parametros) {
    $.ajax({
        type: "GET",
        url: path,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            callback(path, data, parametros);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //alert('Erro:', errorThrown);
        }
    });
}

function EnviarJsonPost(path, entrada, callback, parametros) {
    //alert(entrada);
    $.ajax({
        url: path,
        async: true,
        type: "POST",
        data: entrada,
        contentType: "application/x-www-form-urlencoded", //This is what made the difference.
        dataType: "json",
        success: function (data) {
            callback(path, entrada, data, parametros, undefined);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            callback(path, entrada, undefined, parametros, "error:" + textStatus +  errorThrown + XMLHttpRequest);
        }
    });
}

