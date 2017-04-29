//rota:engine
var express = require('express');
var router = express.Router();
var fs = require('fs')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.end(JSON.stringify({}));
});

/* GET home page. */
router.get('/scripts', function(req, res, next) {
    console.log('aqui dentro do engine....')
    var files = [];
    getFiles(require('path').join(__dirname, '..', 'public', 'engine'), files);
    console.log(files);
    for(var i in files){
        files[i] = files[i].replace(require('path').join(__dirname, '..'), '');
    }
    res.end(JSON.stringify({'scripts': files }));
});

function getFiles(path, files){
    fs.readdirSync(path).forEach(function(file){
        var subpath = path + '/' + file;
        if(fs.lstatSync(subpath).isDirectory()){
            getFiles(subpath, files);
        } else {
            files.push(path + '/' + file);
        }
    });
}


module.exports = router;


