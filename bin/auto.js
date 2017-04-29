var cp = require('child_process');
var fs = require('fs');
var path = require('path');

var server;
var ultima_atualizacao = new Date();

function ExisteScriptSync (callback){
        var exec = require('child_process').exec;
        var child;
        var saida = 0;
        try {
            var busca = "ps aux | grep " + __dirname + "/www | grep -v grep | awk '{print $9}'";
            console.log(busca);
            child = exec(busca, function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + stderr + ' ' + error);
                    callback();
                    return;
                }
                if (stdout.trim() != '') {
                    saida = stdout.trim().split('\n').length;
                    busca = "ps aux | grep " + __dirname + "/www | grep -v grep | awk '{print $2}' | xargs kill -9";
                    console.log(busca);
                    child = exec(busca, function (error, stdout, stderr) {
                        callback();
                        return;
                    });
                }
                else{
                    callback();
                    return;
                }
            });

        }
        catch (ex) {
            console.log(ex.stack);
            callback(null, null);
        }
}

function Iniciar() {
    // Por 1 minuto, nao atualiza nada
    ultima_atualizacao.setMinutes ( ultima_atualizacao.getMinutes() + 1 );

    server = cp.fork(path.join(__dirname, 'www'));
    Monitorar(path.join(__dirname, 'www'));
    Monitorar(path.join(__dirname, 'auto.js'));
    Monitorar(path.join(__dirname, '..', 'app.js'));

    var dir = path.join(__dirname, '..', 'routes');
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (!fs.statSync(name).isDirectory()) {
            Monitorar(name);
        }
    }
}

function Monitorar(file){
    console.log('Monitorando:', file);
    fs.watchFile(file, reload);
}
// TODO: MELHORAR, CARA, CRIAR VARIAVEIS PARA ISSO.
var deve_atualizar = false;
var refreshIntervalId = null;
function reload(event, filename) {

    if(!deve_atualizar){
        refreshIntervalId = setInterval(reloadAgendado, 60 * 1000);
        deve_atualizar = true;
        console.log('Agendar para daqui a 60 segundos.')
        //var exec = require('child_process').exec;
        //exec('npm install --prefix ' + path.join(__dirname, '..'), function (error, stdout, stderr) {
        //    if(error) console.log(error);
        //    if(stderr) console.log(stderr);
        //    console.log('NPM atualizado.');
        //});
    }
}
// Reload agendado
function reloadAgendado(){
    deve_atualizar = false;
    if(refreshIntervalId != null) clearInterval(refreshIntervalId);

    server.kill();
    console.log('Server stopped');
    server = cp.fork(path.join(__dirname, 'www'));
    console.log('Server started');
}





process.on('SIGINT', function () {
    console.log('Finalizando.')
    server.kill();
    fs.unwatchFile(path.join(__dirname, 'www'));
    process.exit();
});


ExisteScriptSync(Iniciar);