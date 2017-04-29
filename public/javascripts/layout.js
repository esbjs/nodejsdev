//-------------- BOTAO LOAD -----------------------
function CommutarBotaoLoad(name){
    if($("#li_" + name).hasClass("fa-circle-o-notch")){
        $("#" + name).removeClass("btn-danger");
        $("#" + name).addClass("btn-success");
        $("#li_" + name).removeClass("fa-circle-o-notch");
    }
    else{
        $("#" + name).removeClass("btn-success");
        $("#" + name).addClass("btn-danger");
        $("#li_" + name).addClass("fa-circle-o-notch");
    }
}




//----------------- POPUP ----------------------------
function AbrirPopup(url, titulo) {
    titulo = titulo || 'Diálogo';
    $("#myModal-title").text(titulo);
    $('#myModal').modal('show');
    $(document).ready(function () {
        $("#contentiframe").attr("src", url);
    });
    rescale();
}

function FecharPopup(){
    $('#myModal').modal('hide');
    //$('#myModal').modal('toggle');
}

function rescale() {
    var size = {width: $(window).width(), height: $(window).height() - 50}
    /*CALCULATE SIZE*/
    var offset = 20;
    var offsetBody = 150;
    $('#myModal').css('height', size.height - offset);
    $('.modal-body').css('height', size.height - (offset + offsetBody));
    $('#myModal').css('top', 0);
}
$(window).bind("resize", rescale);

//------------------ TABELA -----------------------
// rota é a URL; table é a tabela que será peeenchida; callitem é a função que reinderiza cada item
function PreencherTabela(rota, table, columns, callitem, callrow) {
    if(callitem == null){
        callitem = function(key, value){
            return value;
        }
    }
    if(callrow == null) callrow =  function (row, data_row, irow, icel) {};
    columns = columns || [];

    EnviarGet(rota, function (path, data) {
        PreencherTabelaRetorno(data, table,  columns, callitem, callrow);
    });
}

function PreencherTabelaRetorno(data, table, columns, callitem, callrow) {

    var table = document.getElementById(table);
    while (table.childNodes.length > 0) {
        table.removeChild(table.lastChild);
    }
    var montarcolunas = columns.length > 0;
    var irow = 0;
    for (item in data) {
        var row = table.insertRow(irow++);
        var icel = 0;
        for(var key in data[item]){
            if(!montarcolunas){
                columns.push(key);
            }
            var cell = row.insertCell(icel++);
            cell.innerHTML = callitem(key, data[item][key]);
        }
        callrow(row, data[item], irow, icel);
        montarcolunas = true;
    }

    var header = table.createTHead();
    header['class'] = "thead-inverse";
    var row = header.insertRow(0);
    for(var col in columns) {
        var cell = row.insertCell(col);
        cell.outerHTML = "<th><b>"+ columns[col] +"</b></th>";
    }
    callrow(row, null, -1, -1);
}

