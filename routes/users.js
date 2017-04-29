//rota:users
var express = require('express');
var session = require('express-session');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  var user = req.body.user;
  var pass = req.body.pass;

  var sess = req.session;
  sess.user = {"name":"wellington","passowrd":"1234"};
  //sess.project = {"name":"modelo2","path":"/webdev/user/wellington/workspace/modelo2"}
  res.redirect('/projeto/list');
});

module.exports = router;
