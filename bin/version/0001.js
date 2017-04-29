var fs = require('fs');
var path = require('path');
exports.run = function () {
    if(!fileExists(path.join(__dirname, '..', '..', '.config'))){
        fs.mkdirSync(path.join(__dirname, '..', '..', '.config'));
    }

    if(!fileExists(path.join(__dirname, '..', '..', '.config', 'users'))){
        fs.writeFileSync(path.join(__dirname, '..', '..', '.config', 'users'), JSON.stringify(
            {   "version": "0001",
                "users":[{"name": "admin", "passowrd": "admin"},
                    {"name": "wellington", "passowrd": "1234"}]}
        ));
    }

    if(!fileExists(path.join(__dirname, '..', '..', '.config', 'groups'))){
        fs.writeFileSync(path.join(__dirname, '..', '..', '.config', 'groups'), JSON.stringify(
            {   "version": "0001",
                "users":[{"name": "admins", "users": ["admin", "wellington"]}]}
        ));
    }

}



function fileExists(filename){
    try{
        require('fs').accessSync(filename)
        return true;
    }catch(e){
        return false;
    }
}