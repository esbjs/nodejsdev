//rota:bash
var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('bash', { title: 'Express' });
});


router.post('/run', function (req, res, next) {
    try{

        const spawn = require('child_process').spawn;

        const ls = spawn(req.body.command, req.body.parameters);
        console.log('Numero do processo: ', ls.pid);
        fs.writeFileSync('/tmp/log_'+ ls.pid +'.txt', '');
        ls.stdout.on('data', function(data) {
            console.log('stdout: ', data);
            appendFile(data, ls.pid);
        });

        ls.stderr.on('data', function(data){
            console.log("stderr: ", data);
            appendFile(data, ls.pid);
        });

        ls.on('close', function(code) {
            console.log("child process exited with code", code);
            appendFile(code, ls.pid);
        });

        res.end(JSON.stringify({'status': true, "pid": ls.pid}));
    }
    catch (e) {
        console.log(e);
        appendFile(e.stack, ls.pid);
        res.end(JSON.stringify({'status': false, "err": e.stack}));
    }
});

function appendFile(dados, pid){
    fs.appendFile('/tmp/log_'+ pid +'.txt', dados, function (err) {
    });
}


module.exports = router;
