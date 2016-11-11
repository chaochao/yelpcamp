var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Camp",campSchema);//create "table"
module.exports = Campground;