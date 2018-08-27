const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true
};
mongoose.connect(
  "mongodb://localhost/cat",
  options
);

const schema = mongoose.Schema({
  name: String
});
schema.methods.meow = function() {
  console.log(this.get("name"));
};

const Cat = mongoose.model("cat", schema);

const kitty = new Cat({ name: "Zildjian" });
kitty.save().then(() => {
  kitty.meow();
});
