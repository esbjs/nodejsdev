//rota:projeto
var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('projeto', { title: 'Project' });
});

router.get('/list', function(req, res, next) {
    res.render('projetos', { title: 'Project' });
});

router.post('/entrar', function (req, res, next) {
    var sess = req.session;
    var pathfile = '/webdev/user/' + sess.user.name + '/workspace/' + req.body.name + '/.project/run';


    if(!doesExist(pathfile)){
        fs.mkdirSync('/webdev/user/' + sess.user.name + '/workspace/' + req.body.name + '/.project/');
        var js = {"name":"modelo2","path":"/webdev/user/" + sess.user.name+ "/workspace/" + req.body.name,
            "engine":"node","bind":"http://localhost/","script":"bin/www"};
        fs.writeFileSync(pathfile, JSON.stringify(js));
        sess.project = js;
        res.end(JSON.stringify({"status": true}));
    }
    else {

        sess.project = JSON.parse(fs.readFileSync(pathfile));
        res.end(JSON.stringify({"status": true}));
    }
});

function doesExist(pathfile) {
    try {
        fs.statSync(pathfile)
        return true
    } catch(err) {
        return !(err && err.code === 'ENOENT');
    }
}


router.get('/listdata', function(req, res, next) {
    var files = fs.readdirSync('/webdev/user/wellington/workspace/');

    var data = [];
    for (var i in files) {
        if (fs.statSync('/webdev/user/wellington/workspace/' + files[i]).isDirectory()) {
            data.push({"nome": files[i]});
        }
    }
    console.log(data);
    res.end(JSON.stringify(data));
});


module.exports = router;
