var codigo_ext = ['.js', '.css', '.json', '.sh'];

// -------------------------------- SCRIPTS --------------------------
function LoadScripts(){
    EnviarGet('/engine/scripts', function(path, data) {

        for (var i in data.scripts) {
            if(data.scripts[i].indexOf('.js') > 0) addScript(data.scripts[i]);

        }
    });
}

function addScript( src ) {
    var s = document.createElement( 'script' );
    s.setAttribute( 'src', src );
    document.body.appendChild( s );
}

// ------------------------------------ BOTOES TOOLBAR ------------------------------------------
function NovaPasta(){
    AbrirPopup('/dev/novodiretorio')
}

function NovoArquivos(){
    AbrirPopup('/dev/novoarquivo')
}

function UploadArquivo(){
    AbrirPopup('/dev/upload')
}

// ------------------------------------CARREGAMENTO DE UM ARQUIVO -----------------------------------

function ExcluirArquivo(documento, tab_count) {

    if(confirm("Confirma a exclusão do arquivo: " + documento + "?")){
        EnviarJsonPost("/dev/arquivoexcluir", {"documento": documento, "tab_count": tab_count}, function(path, entrada, data){
            FecharAba(tab_count)
        });
    }
}

function CarregarArquivo(documento, id_div, tab_count) {
    EnviarJsonPost("/dev/arquivo", {"documento": documento, "div": id_div, "tab_count": tab_count}, EscreverTextArea);
}

function EscreverTextArea(path, entrada, data) {
    $("textarea[name='" + entrada.div + "']").text(data.texto);
}
function AtivarTextArea(nome) {
    // initialisation
    editAreaLoader.init({
        id: nome	// id of the textarea to transform
        , start_highlight: true	// if start with highlight
        , allow_resize: "both"
        , allow_toggle: true
        , word_wrap: true
        , language: "en"
        , syntax: "js"
        , replace_tab_by_spaces: 4
    });
}
// ------------------------------------ MONTAGEM DA ABA/DESMONTAGEM -----------------------------------------------
var tab_count = 0;
function AbrirDocumento(documento) {
    tab_count++;
    var nome = documento.substring(documento.lastIndexOf('/') + 1);
    $('#ul_paginas').append(
        $('<li>').attr('id', 'li_menu' + tab_count).attr('class', 'active').append(
            $('<a>').attr('href', '#menu' + tab_count).attr('data-toggle', 'tab').append(nome + ' ')));
    $('#div_paginas')
        .append($('<div>').attr('id', 'menu' + tab_count).attr('class', 'tab-pane fade in active')
            .append($('<div>').attr('class', 'btn-toolbar').attr('role', 'toolbar')
                .append($('<div>').attr('class', 'btn-group')
                    .append($('<button>').attr('role', 'button').attr('class', 'btn btn-primary btn-color btn-bg-color btn-sm col-xs-2').attr('onClick', 'SalvarAba(\'' + tab_count + '\',\'' + documento + '\');')
                        .append('<span>').attr('class', 'glyphicon glyphicon-hdd').attr('aria-hidden', 'true'))
                    .append($('<button>').attr('role', 'button').attr('class', 'btn btn-primary btn-color btn-bg-color btn-sm col-xs-2').attr('onClick', 'FecharAba(\'' + tab_count + '\');')
                        .append('<span>').attr('class', 'glyphicon glyphicon-remove').attr('aria-hidden', 'true'))
                    .append($('<button>').attr('role', 'button').attr('class', 'btn btn-primary btn-color btn-bg-color btn-sm col-xs-2').attr('onClick', 'ExcluirArquivo(\''+ documento +'\',\'' + tab_count + '\');')
                        .append('<span>').attr('class', 'glyphicon glyphicon-remove-sign').attr('aria-hidden', 'true'))
            )).append('Path: ' + documento)
            .append($('<textarea>').attr("onkeydown", "if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'    '+v.substring(e);this.selectionStart=this.selectionEnd=s+4;return false;}").attr('id', 'area_' + tab_count).attr('name', 'area_' + tab_count).attr('rows', '25').attr('class', 'form-control codigo')
        ).append($('<input>').attr('type', 'hidden').attr('id', 'hidden_code_' + tab_count).attr('name', 'hidden_code_' + tab_count))
    );
    // TODO: MELHORAR, SÓ ATIVAR A ULTIMA PAGINA SE CARREGAR.
    var codigo = false;
    for(var i = 0; i < codigo_ext.length; i++){
        if(documento.indexOf(codigo_ext[i]) > 0){
            codigo = true;
            break;
        }
    }
    if(codigo) {
        CarregarArquivo(documento, 'area_' + tab_count, tab_count);
        AtivarTextArea('area_' + tab_count);
    }
    else{
        $('#area_' + tab_count).hide();
    }

    AtivarUltimaAba();
}

function AtivarUltimaAba() {
    var tamanho = $("#div_paginas").children().length;
    $("#div_paginas").children().each(function (i, elm) {
        if (i < tamanho - 1) {
            $(elm).removeClass("active");
        }
    });

    tamanho = $("#ul_paginas").children().length;
    $("#ul_paginas").children().each(function (i, elm) {
        if (i < tamanho - 1) {
            $(elm).removeClass("active");
        }
    });
}

// Chamado pelo botao X da interface gráfica
function FecharAba(id) {
    $('#menu' + id).remove();
    $('#li_menu' + id).remove();
    // pegr ultimo elemento
    $("#div_paginas").children().last().addClass('active');
    $("#ul_paginas").children().last().addClass('active');
}

function SalvarAba(id, documento) {
    var thought = editAreaLoader.getValue("area_" + id);//$('#area_' + id).val();
    var envelope = {'texto': thought, 'documento': documento};
    //alert(thought);
    EnviarJsonPost("/dev/salvararquivo", envelope, SalvarAbaRetorno);
}

function SalvarAbaRetorno(path, entrada, data) {
    outPut("Documento salvo:" + entrada.documento + data.texto);
}

// -------------------------------------- MONTAGEM DA TREEVIEW -----------------------------------
function CarregarArquivos() {
    EnviarJsonPost("/dev/arquivos", {}, Montar);
}

function Montar(path, entrada, data) {
    $('#div_tree2_container').empty();
    $("<div id=\"div_tree2\">").appendTo("#div_tree2_container");
    $('#div_tree2')
        .on('changed.jstree', function (e, data) {
            if (data.node.original.isFile) {
                AbrirDocumento(data.node.original.path);
            }
            //$('#hd_no').val(data.node.original.path);
            $('input[id=hd_no]').val(data.node.original.path);
        })

        .jstree({
            'core': {
                'data': data
            }
        });
    $('#div_tree2').on('contextmenu', '.jstree-anchor', function (e) {

        var node = $('#div_tree2').jstree(true).get_node(e.target);

        $('#hd_no').val(node.original.path);

        var evt =  window.event || event;
        var button = evt.which || evt.button;
        if( button != 1 && ( typeof button != "undefined")) return false;
    });
}


// ------------------------------------ AUXILIAR ---------------------------------
function outPut(s, flush) {
    //text_out
    if (flush != null) {
        $("textarea#text_out").val('');
    }
    $("textarea#text_out").val($("textarea#text_out").val() + '\n' + s);
    $("textarea#text_out").scrollTop($("textarea#text_out")[0].scrollHeight);
    //div_out.innerText = s + '\r\n' + div_out.innerText;
}

function GetInput(name){
    return $('input[id='+ name +']').val();
}