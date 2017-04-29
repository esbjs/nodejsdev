

function Importar(){

    $("<li><a href=\"JavaScript:AbrirPopup('/node/runconfig','Configuração deploy Node.js');\">Configuração Node.js</a></li>").appendTo("#menu_arquivo");
    $("<li><a href='#'>Node + Jade Form</a></li>").appendTo("#menu_arquivo_novo");
    $("#menu_arquivo_novo").menu("refresh");
}
Importar();
