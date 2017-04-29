var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dinrouter = require(path.join(__dirname, 'bin', 'routes.js'));
var routes = require('./routes/index');
var session = require('express-session');
var multer = require('multer');
var fs = require('fs');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh'}));
app.use(multer({ dest: '../uploads/'}).any())
app.get('*', function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/', routes);
dinrouter.routes(app);

app.get('/version', function (req, res, next) {
  res.end(JSON.stringify({'version':'1.002'}));
});


app.get('/engineTeste/scripts', function (req, res, next) {
  res.end(JSON.stringify({'scripts' : []}));
});






var upload = multer({ dest: '../uploads/'});

app.post('/dev/uploadfile',  function(req, res) {
  //console.log(req);
  try {

    console.log(req.body.hd_no);
    var file = path.join(req.body.hd_no, req.files[0].originalname);

    console.log('Nome do arquivo:', file);
    console.log(JSON.stringify(req.files[0]));

    fs.rename(path.join(req.files[0].path), file, function (err) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        res.json({
          message: 'File uploaded successfully',
          filename: req.files[0].originalname
        });
      }
    });
  }catch(e){
    console.error(e.stack);

  }
});



app.get('/entrar', function (req, res, next) {
  var sess = req.session;
  sess.user = {"name":"wellington","passowrd":"1234"};
  //sess.project = {"name":"modelo2","path":"/webdev/user/wellington/workspace/modelo2"}
  res.redirect('/projeto/list');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;


