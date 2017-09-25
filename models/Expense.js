var mongoose = require("mongoose");

var expenseSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'members'
  },
  amount: Number,
  took_part: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'members'
  }]
});

module.exports = mongoose.model("expenses", expenseSchema);
