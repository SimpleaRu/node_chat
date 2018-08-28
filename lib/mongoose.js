const mongoose = require("mongoose");
var config = require("../config/config");

mongoose.connect(
  config.mongoose.uri,
  config.mongoose.option
);

module.exports = mongoose;
