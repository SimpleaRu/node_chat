const User = require('models/user').User;
const async = require('async');
var User = require("../models/user").User;
var HttpError = require("../error").HttpError;


exports.get = function(req, res) {
  res.render("login");
};

exports.post = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

}

async.waterfall([

]);

User.findOne({username: username}, function(err, user) {
  if (err) return next(err)
  if (user) {
    if (user.checkPassword(password)) {
      // 200
    } else {
      // 403
    }
  } else {
    var user = new User({username: username, password: password});
    user.save(function(err) {
      if (err) return next(err);
    })
  }
})