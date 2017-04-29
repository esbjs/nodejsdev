

// -----------------------------PROCESS NODE
/*function ProcessNode(){
    EnviarJsonPost("/node/processnode", {}, function (path, entrada, data) {
        for(var i = 0; i < data.process.length; i++){
            alert(data.process[i].command)
        }
    });
}*/

function ProcessTable_Row(row, data_row, irow, icel) {
    if(irow < 0) return;

    var cell = row.insertCell(0);
    cell.innerHTML = "<button id=\"btn_kill_"+ data_row[Object.keys(data_row)[0]] +"\" onclick='JavaScript:ProcessKill(\""+ data_row[Object.keys(data_row)[1]]
        +"\")' class=\"btn btn-secondary btn-sm\"> <li id=\"li_btn_kill_"+ data_row[Object.keys(data_row)[1]]
        +"\" class=\"fa fa-spin\"></li><span class=\"glyphicon glyphicon-remove-circle\" aria-hidden=\"true\"></span></button>";
    cell.width = 20;
}
function ProcessKill(id){
    var nome_btn = "btn_kill_" + id;
    CommutarBotaoLoad(nome_btn);
    EnviarJsonPost("/node/killprocessnode", {"pid": id}, function (path, entrada, data) {
        CommutarBotaoLoad(nome_btn);
        PreencherTabela('/node/processnode', 'tab_process', ['','Usuário', 'PID', 'Comando'], null, ProcessTable_Row);
    });
}

// ============================== NPM
function Npm(){
    CommutarBotaoLoad('btn_npm');
    EnviarJsonPost("/node/npm", {}, function (path, entrada, data) {
        CommutarBotaoLoad('btn_npm');
    });
}

function Run(){
    EnviarJsonPost("/node/run", {}, Run01);
}

function NpmInstall(){
    var name = $("#txt_package").val();
    CommutarBotaoLoad('btn_npm_install');
    EnviarJsonPost("/node/npminstallpackage", {"package": name}, function(path, entrada, data){
        CommutarBotaoLoad('btn_npm_install');
        PreencherTabela('/node/dependencies', 'tab_npm', ['Pacote', 'Versão'], null, NpmTable_Row);
    });
}

function NpmUninstall(name){
    var nome_btn = "btn_uninstall_" + name;
    CommutarBotaoLoad(nome_btn);
    EnviarJsonPost("/node/npmuninstallpackage", {"package": name}, function(path, entrada, data){
        CommutarBotaoLoad(nome_btn);
        PreencherTabela('/node/dependencies', 'tab_npm', ['Pacote', 'Versão'], null, NpmTable_Row);
    });
}

function NpmTable_Row(row, data_row, irow, icel) {
    if(irow < 0) return;

    var cell = row.insertCell(0);
    //cell.innerHTML = "<a href='JavaScript:NpmUninstall(\""+ data_row[Object.keys(data_row)[0]] +"\")'>X</a>";
    cell.innerHTML = "<button id=\"btn_uninstall_"+ data_row[Object.keys(data_row)[0]] +"\" onclick='JavaScript:NpmUninstall(\""+ data_row[Object.keys(data_row)[0]] +"\")' class=\"btn btn-secondary btn-sm\"> <li id=\"li_btn_uninstall_"+ data_row[Object.keys(data_row)[0]] +"\" class=\"fa fa-spin\"></li><span class=\"glyphicon glyphicon-remove-circle\" aria-hidden=\"true\"></span></button>";

    cell.width = 20;
}

function Run01(path, entrada, data){
    sleep(1000);
    if(data.hasOwnProperty('err')){
        alert(data.err);
    }
    else{
        window.open(data.url);
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}