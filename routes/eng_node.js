//rota:node
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var session = require('express-session');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// ------------- processos node -----------
router.post('/killprocessnode', function (req, res, next) {
    try {
        var exec = require('child_process').exec;
        var sess = req.session;
        exec('kill ' + req.body.pid, function (error, stdout, stderr) {
            res.end(JSON.stringify({'status': true, "output": stdout}));
        });
    }
    catch (e) {
        console.log(e);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
});


router.get('/processnode', function (req, res, next) {
    try {

        var exec = require('child_process').exec;
        var sess = req.session;

        exec('ps aux | grep /webdev/user/ | grep -v grep ', function (error, stdout, stderr) {


            //usuario  17803  0.0  0.3 805932 26440 ?        Sl   Sep14   0:50 node /webdev/ide/bin/auto.js
            console.log(stdout);
            var linhas = stdout.split('\n');
            console.log(linhas);
            var retorno = [];
            for(var i = 0; i < linhas.length; i++){
                if(linhas[i].trim() == '') continue;

                var colunas = linhas[i].replace(/\s+/igm, ' ').split(' ');
                retorno.push({'usuario': colunas[0], 'pid' : colunas[1], 'command' : colunas[10] + ' ' + colunas[11]})


            }
            res.end(JSON.stringify(retorno));

        });
    }
    catch (e) {
        console.log(e);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
});




router.post('/npm', function (req, res, next) {
    try {
        var exec = require('child_process').exec;
        var sess = req.session;
        exec('npm install --prefix ' + sess.project.path , function (error, stdout, stderr) {
            var retorno = {'output': stdout};
            if (error || stderr) {
                retorno.err = error + stderr;
            }
            res.end(JSON.stringify(retorno));
        });
    }
    catch (e) {
        console.log(e);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
});


router.post('/run', function (req, res, next) {
    try {

        fs.writeFileSync('/tmp/log.txt', '');

        var exec = require('child_process').exec;
        var sess = req.session;

        exec('ps aux | grep ' + sess.project.path + '/' + sess.project.script + ' | grep -v grep | awk \'{print $2}\' | xargs kill', function (error, stdout, stderr) {
            runNode(req, res);
        });
    }
    catch (e) {
        console.log(e);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
});
function runNode(req, res){
    try{
        var sess = req.session;
        const spawn = require('child_process').spawn;
        const ls = spawn('node', [sess.project.path + '/' + sess.project.script, '-p', '3011']);

        ls.stdout.on('data', function(data) {
            console.log('stdout: ', data);
            appendFile(data);
        });

        ls.stderr.on('data', function(data){
            console.log("stderr: ", data);
            appendFile(data);
        });

        ls.on('close', function(code) {
            console.log("child process exited with code", code);
            appendFile(code);
        });
    }
    catch (e) {
        console.log(e);
        appendFile(e.stack);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
}

function appendFile(dados){
    fs.appendFile('/tmp/log.txt', dados, function (err) {
    });
}

router.get('/runconfig', function (req, res, next) {
    var sess = req.session;
    var js = sess.project;
    require(path.join(__dirname, '..', 'bin', 'schema.js')).Merge(js, 'project', res);
});

router.get('/dependencies', function (req, res, next) {
    ReturnDependencies(req, res);
});

function ReturnDependencies(req, res){
    fs.readFile(path.join(__dirname, '..', 'package.json'),function (err, data){
        if(err) console.log(err);
        var dep = JSON.parse(data.toString()).dependencies;
        var retorno = [];
        for(var item in dep){
            retorno.push({"name": item, "version": dep[item]});
        }
        res.end(JSON.stringify(retorno));
    });
}

router.post('/npminstallpackage', function (req, res, next) {
    try {
        var exec = require('child_process').exec;
        exec('npm install '+ req.body.package +' --save', function(error, stdout, stderr){
            ReturnDependencies(req, res);
        });
    }
    catch (e) {
        console.log(e);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
});
router.post('/npmuninstallpackage', function (req, res, next) {
    try {
        var exec = require('child_process').exec;
        exec('npm uninstall '+ req.body.package +' --save', function(error, stdout, stderr){
            ReturnDependencies(req, res);
        });
    }
    catch (e) {
        console.log(e);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
});


router.post('/runconfigsave', function (req, res, next) {
    var sess = req.session;
    sess.project = req.body;

    fs.writeFile(req.body.path + '/.project/run', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        console.log(sess.project);
        res.end(JSON.stringify({'status': true}));
    });

});

module.exports = router;


