var express = require("express");
var http = require("http");
var path = require("path");
var config = require("./config/config");
var app = express();
app.set("port", config.port);
var log = require("./libs/log")(module);

http.createServer(app).listen(app.get("port"), function() {
  log.info("Express server listening on port " + config.port);
});

app.engine("ejs", require("ejs-locals"));
app.set("views", __dirname + "/templates");
app.set("view engine", "ejs");

app.use(express.bodyParser()); // req.body....
app.use(express.cookieParser()); // req.cookies
app.use(app.router);

app.get("/", function(req, res, next) {
  res.render("index", {});
});
app.use(express.static(path.join(__dirname, "public")));

app.use(function(err, req, res, next) {
  // NODE_ENV = 'production'
  if (app.get("env") == "development") {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});
