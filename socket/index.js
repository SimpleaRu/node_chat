var log = require("../lib/log")(module);
var config = require("../config/config");
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var sessionStore = require('../lib/sessionStore');
const User = require('../models/user').User;

function loadSession(sid) {
  return sessionStore.get(sid, function (err, session) {
    return new Promise((resolve, reject) => {
      if (!session) {
        console.log('No session')
        reject()
      } else {
        resolve(session);
      }
    })
  });
}

function loadUser(session) {
  return new Promise((resolve, reject) => {
    if (!session.user) {
      log.debug('Session is anonymos', session.id)
      reject();
    }
    User.findById(session.user).exec((err, user) => {
      if (err) return reject(err);
      if (!user) reject();
      resolve(user);
    })
  })
}

module.exports = function (server) {
  var io = require("socket.io").listen(server);
  io.set("origins", "localhost:*");
  io.set("logger", log);

  io.use(function (socket, next) {
    var handshakeData = socket.request
    handshakeData.cookies = cookie.parse(handshakeData.headers.cookie);
    var sidCookie = handshakeData.cookies[config.session.key];
    const sid = cookieParser.signedCookie(sidCookie, config.session.secret);
    if (!sid) {
      return 'No sid find';
    } else {
      loadSession(sid)
        .then(session => {
          socket.handshake.session = session;
          next();
        })
    }
  });

  io.use(function (socket, next) {
    loadUser(socket.handshake.session)
      .then(user => {
        socket.handshake.user = user;
        next();
      })
  });


io.on("connection", function (socket) {
  var username = socket.handshake.user.username;
  socket.broadcast.emit('join', username);
  socket.on("message", function (text, cd) {
    socket.broadcast.emit("message", username, text);
    cd && cd();
  });
  socket.on('disconnect', function () {
    socket.broadcast.emit('leave', username);
  })

});
return io;
};
