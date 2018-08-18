var express = require('express');
var http = require('http');
var path = require('path');
var config = require("./config/config")
var app = express();
app.set('port', config.port);
var log = require('./libs/log')(module);

http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + config.port);
});

// Middleware
app.use(function(req, res, next) {
  if (req.url == '/') {
    res.end("Hello");
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if (req.url == '/forbidden') {
    next(new Error("wops, denied"));
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if (req.url == '/test') {
    res.end("Test");
  } else {
    next();
  }
});

app.use(function(req, res) {
  res.send(404, "Page Not Found Sorry");
});

app.use(function(err, req, res, next) {
  // NODE_ENV = 'production'
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});