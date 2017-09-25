var express = require("express");
var ip = require("ip");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var projectsController = require("./controllers/projectsController");

mongoose.connect("mongodb://localhost:27017/remembeer");
var urlencodedParser = bodyParser.urlencoded({extended: false});

var app = express();

// set up template engine
app.set('view engine', 'ejs');
// static files
app.use(express.static('.'));

// handle main page
app.get('/', function(req, res) {
  res.render('index');
});

// fire project controller
projectsController(app);

// listen to port
app.listen(3000, ip.address(), function() {
  console.log("Now listening on " + ip.address() + ":3000");
});
