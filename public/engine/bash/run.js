
function init(){

    $("<li id='menu_bash'><a href='#' class='dropdown-toggle' data-toggle='dropdown'>Bash <b class='caret'></b></a></li>").appendTo("#menu");
    $("<ul id='menu_bash_ul' class='dropdown-menu'></ul>").appendTo("#menu_bash");
    $("<li><a href=\"JavaScript:AbrirPopup('/bash/','Scripts Bash');\">Scripts Bash</a></li>").appendTo("#menu_bash_ul")
    $("#menu").menu("refresh");
}
init();



