var express = require("express");
var http = require("http");
var path = require("path");
var config = require("./config/config");
var app = express();
app.set("port", config.port);
var log = require("./lib/log")(module);
var HttpError = require("http-errors").HttpError;
var mongoose = require("./lib/mongoose");

console.log(HttpError);

http.createServer(app).listen(app.get("port"), function() {
  log.info("Express server listening on port " + config.port);
});

app.engine("ejs", require("ejs-locals"));
app.set("views", __dirname + "/templates");
app.set("view engine", "ejs");

app.use(express.bodyParser()); // req.body....
app.use(express.cookieParser()); // req.cookies

var MongoStore = require("connect-mongo")(express);

app.use(
  express.session({
    secret: config.session.secret,
    key: config.session.key,
    cookie: config.session.cookie,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// app.use(function(req, res, next) {
//   req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//   res.send("Visits: " + req.session.numberOfVisits);
// });

app.use(require("./middleware/sendHttpError"));
app.use(app.router);

require("./routes")(app);

app.use(express.static(path.join(__dirname, "public")));

app.use(function(err, req, res, next) {
  if (typeof err == "number") {
    err = new HttpError(err);
  } else {
    /*   if (err instanceof HttpError) {
    res.sendHttpError(err);
  } */
    if (app.get("env") == "development") {
      express.errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});
