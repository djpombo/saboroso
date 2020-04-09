var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');//instanciando o Redis
var session = require('express-session');
var RedisStore = require('connect-redis')(session);//(session) já eh passada via construtor direto
var redisClient = redis.createClient();
var formidable = require('formidable');
//var http = require('http');
//var socket = require('socket.io');
var path = require('path');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();


/**
 * MIDDLEWARE do formidable, para passar ajax do front para o back, inclusive multiparts
 */
app.use(function(req, res, next){
 
  let contentType = req.headers["content-type"];
 
  if (req.method === 'POST' && contentType.indexOf('multipart/form-data;') > -1) {
    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/images"),
      keepExtensions: true
    });
 
    form.parse(req, function(err, fields, files){
      
      req.body = fields;
      req.fields = fields;
      req.files = files;
 
      next();
 
    });
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware do Redis
app.use(session ({

  store: new RedisStore({
    client:redisClient,//criando um client no Redis nesta sessao
    host: 'localhost',
    port: 6379
  }),
    secret: 'p@ssw0rd',
    resave: true,//se a sessao cair a senha volta
    saveUninitialized: true

}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/*
http.listen(3000, function(){

  console.log("Servidor em execução...");

});
*/

module.exports = app;


