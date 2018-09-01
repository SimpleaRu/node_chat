var User = require("./models/user").User;
var mongoose = require('./lib/mongoose')

var user = new User({
  username: "Tester",
  password: "secret"
});

mongoose.connection.on('open', function () {
  var db = mongoose.connection.db;
  db.dropDatabase(function (err) {
    if (err) throw err;
    user.save(function (err, user, affected) {
      if (err) throw err;
      User.findOne({ username: "Tester" }, function (err, tester) {
        console.log(tester);
        mongoose.disconnect();
      });
    });
  })
})
