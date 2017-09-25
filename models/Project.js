var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
  owner_id: Number,
  title: String,
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'members'
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'expenses'
  }]
});

module.exports = mongoose.model("projects", projectSchema);
