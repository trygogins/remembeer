var mongoose = require("mongoose");

var memberSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model("members", memberSchema);
