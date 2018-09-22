var log = require("../lib/log")(module);
var config = require("../config/config");
var cookie = require('cookie');
var cookieParser = require('cookie-parser')

module.exports = function(server) {
  var io = require("socket.io").listen(server);
  io.set("origins", "localhost:*");
  io.set("logger", log);

   io.use(function(socket, next) {
    var handshakeData = socket.request
    handshakeData.cookies = cookie.parse(handshakeData.headers.cookie);
    var sidCookie = handshakeData.cookies[config.session.key];
    const sid = cookieParser.signedCookie(sidCookie, config.session.secret);
    console.log(sid);
    next();
  });

  io.on("connection", function(socket) {
    socket.on("message", function(text, cb) {
      console.log(text);
      socket.broadcast.emit("message", text);
      cb(text);
    });
  });
};
