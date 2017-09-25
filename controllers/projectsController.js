var Project = require("../models/Project");
var Member = require("../models/Member");
var Expense = require("../models/Expense");

var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/remembeer");
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {

  app.get('/projects', function(req, res) {
    Project.find({owner_id : 1}, function(err, data) {
      if (err) throw err;
      res.render('profile', {projects: data, success: req.query.success == "true" });
    });
  });

  app.post('/projects', urlencodedParser, function(req, res) {
    var newProject = Project({ owner_id : 1, title : req.body.title, members : [] }).save(function(err, data) {
      if (err) throw err;
      res.redirect('/projects?success=true');
    });
  });

  app.get('/projects/:id', function(req, res) {
    Project.findOne({_id : req.params.id})
      .populate('expenses')
      .populate('members')
      .exec(function(err, data) {
        console.log("get project info: ", data.title);
        res.render('project', { project: data });
    });
  });

  app.post('/projects/:id/newmember', urlencodedParser, function(req, res) {
    Member({ name: req.body.name }).save(function(err, data) {
      if (err) throw err;
      Project.findOne({_id: req.params.id}, function(err, data2) {
        console.log("new member in: " + data2.title);
        data2.members.push(data.id);
        data2.save();

        res.redirect('/projects/' + req.params.id);
      });
    });
  });

  app.post('/projects/:id/newexpense', urlencodedParser, function(req, res) {
    Expense(req.body).save(function(err, data) {
      if (err) throw err;
      Project.findOne({_id : req.params.id}, function(err, data2) {
        console.log("new expense in: ", data2.title);
        data2.expenses.push(data.id);
        data2.save();

        res.redirect('/projects/' + req.params.id);
      });
    });
  });

  app.get('/projects/:id/summary', function(req, res) {
    Project.findOne({_id : req.params.id})
      .populate('expenses')
      .populate('members')
      .exec(function(err, data) {
        console.log("summary for: ", data.title);
        var result = [];
        for (i = 0; i < data.members.length; i++) {
          current_guy = data.members[i];
          var spent = data.expenses
            // leaves only items that current_guy took part in:
            .filter(item => item.took_part.indexOf(current_guy._id) > -1)
            // calculates spendings by dividing the amount into equal parts:
            .reduce((a, b) => a + (b==0?0:b.amount / b.took_part.length), 0);
          var paid = data.expenses
            // leaves only items that current_guy paid for:
            .filter(item => item.owner.equals(current_guy._id))
            // sums all the amounts:
            .reduce((a,b) => a + b.amount,0);

          result.push({
            _id: data.members[i]._id,
            name: data.members[i].name,
            spent: spent,
            paid: paid
          });
        }

        res.render('summary', {result: result});
    });
  });
}
