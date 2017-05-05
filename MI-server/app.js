var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var socket = require('socket.io');
var server = require('./bin/www');


var config = require('./config');
var useSocket = require('./socket');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/MI');

var api = require('./apis');

var app = express();

var io = server(app, socket);

// view engine setup
app.set('error.ejs', path.join(__dirname, 'error.ejs'));
app.set('view engine', 'ejs');

app.set('secret',config.jwtSecret);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api(app, io));

app.use('/demo/test/mi', function (req, res) {
    res.render('index');
});

useSocket(io);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// module.exports = app;
