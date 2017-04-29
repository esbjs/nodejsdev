var fs = require('fs');
var path = require('path');


exports.Merge = function (json, name, res) {
    if (fs.existsSync(path.join(__dirname, '..', 'schema', name))) {
        fs.readFile(path.join(__dirname, '..', 'schema', name), function (err, data) {
            if (err) {
                res.end(JSON.stringify({"texto": err}));
            }
            else {
                MergeInterno(json, JSON.parse(data), res);
                return;
            }
        });
    }
    else {
        MergeInterno(json, {}, res);
        return;
    }
}

function MergeInterno(json, sh, res) {
    var retorno = [];
    var keys = [];
    for (var key in json) {
        var buffer = {};
        buffer['field'] = key;
        buffer['caption'] = key;
        buffer['length'] = 400;
        buffer['type'] = 'string';
        buffer['value'] = json[key];
        for (var i in sh.fields) {
            if(sh.fields[i].field == key){
                buffer['length'] = sh.fields[i]['length'];
                buffer['type'] = sh.fields[i]['type'];
                buffer['caption'] = sh.fields[i]['caption'];
                break;
            }
        }
        retorno.push(buffer);
    }
    // AGORA INVERTER
    for (var i in sh.fields){
        var encontrado = false;
        for(var j in retorno){
            if(sh.fields[i].field == retorno[j].field){
                encontrado = true;
                break;
            }
        }
        if(!encontrado){
            sh.fields[i]['value'] = '';
            retorno.push(sh.fields[i])
        }
    }

    res.render('nodeRunConfig', { "projeto" : retorno, "rota": "/node/runconfigsave" } );

}

