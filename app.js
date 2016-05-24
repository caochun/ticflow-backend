var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var flash = require('connect-flash');

//web router
var routes = require('./routes/web/index');
var manager = require('./routes/web/manager');
var myexport = require('./routes/web/export');
var treasurer = require('./routes/web/treasurer');
var profits = require('./routes/web/profits');
var adminfees = require('./routes/web/adminfees');
var managefees = require('./routes/web/managefees');
var total = require('./routes/web/total');
var cashflow = require('./routes/web/cashflow');
var prestore = require('./routes/web/prestore');

//app router
var users = require('./routes/app/users');
var lists = require('./routes/app/lists');
var valuechanges = require('./routes/app/valuechanges');
var upload = require('./routes/app/upload');

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

    res.locals.user = req.session.user;

    next();
});

app.use('/', routes);
app.use('/manager', manager);
app.use('/export', myexport);
app.use('/treasurer', treasurer);
app.use('/profits', profits);
app.use('/adminfees', adminfees);
app.use('/managefees', managefees);
app.use('/total', total);
app.use('/cashflow', cashflow);
app.use('/prestore', prestore);

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
