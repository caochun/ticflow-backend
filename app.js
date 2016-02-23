var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');
var lists = require('./routes/lists');
var valuechanges = require('./routes/valuechanges');
var upload = require('./routes/upload');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ticflow', function(err) {
  if (err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'logo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
    secret: 'jsx_online',// 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 30 * 60 *60 * 1000 },
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(function (req,res,next) {
    var err = req.flash('error');
    res.locals.error = err.length ? err: null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;

    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/lists', lists);
app.use('/valuechanges', valuechanges);
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});


module.exports = app;
