//rota:dev
var express = require('express');
var session = require('express-session');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');


/* GET home page. */
router.get('/', function (req, res, next) {
    var sess = req.session;
    res.render('dev', {title: sess.project.name});
});

router.get('/upload', function (req, res, next) {
    var sess = req.session;
    res.render('upload', {title: sess.project.name});
});




router.post('/arquivo', function (req, res, next) {
    try {
        fs.readFile(req.body.documento, function (err, data) {
            if (err) {
                res.end(JSON.stringify({"texto": err}));
            }
            else {
                res.end(JSON.stringify({"texto": data.toString()}));
            }

        });
    } catch (e) {
        res.end(JSON.stringify({"texto": e}));
    }
});
//
router.post('/arquivoexcluir', function (req, res, next) {
    try {
        console.log(req.body.document);
        fs.unlink(req.body.documento, function (err) {
            if (err) {
                res.end(JSON.stringify({"texto": err}));
            }
            else {
                res.end(JSON.stringify({"texto": 'sucesso'}));
            }

        });
    } catch (e) {
        res.end(JSON.stringify({"texto": e}));
    }
});


router.post('/salvararquivo', function (req, res, next) {
    try {
        console.log(req.body.texto);
        fs.writeFile(req.body.documento, req.body.texto, 'utf8', function (err) {
            if (err) {
                console.log(err);
                res.end(JSON.stringify({"texto": err}));
            }
            else {
                res.end(JSON.stringify({"texto": ""}));
            }
        });
    } catch (e) {
        res.end(JSON.stringify({"texto": e}));
    }
});

router.post('/arquivos', function (req, res, next) {
    try {
        var sess = req.session;
        var raiz = sess.project.path;

        var array = [];
        getFiles(raiz, array, raiz,"#");
        res.end(JSON.stringify(array));
    } catch (e) {
        console.log(e);
        res.end(JSON.stringify({"alert": e}));
    }
});

function getFiles(dir, files_, raiz, parent_id) {
    files_ = files_ || [];

    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        var meu_id = name.replace(/\W+/gim,'');
        if (fs.statSync(name).isDirectory()) {

            if (name.indexOf('/node_modules') < 0 && name.indexOf('/.') < 0) {
                var novoDir = {"id": meu_id, "parent": parent_id,  "path": name, "text" : name.substring(name.lastIndexOf('/') + 1), "subdir": name.replace(raiz, ""), "isFile": false};
                files_.push(novoDir);
                getFiles(name, files_, raiz, meu_id);
            }
        } else {

            //files_.push(name);
            files_.push({"id": meu_id, "parent": parent_id,  "path": name, "text" : name.substring(name.lastIndexOf('/') + 1), "subdir": name.replace(raiz, ""), "isFile": true, "icon": "/"});
        }
    }
    return files_;
}

module.exports = router;
