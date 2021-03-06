var express = require("express");
var path = require('path');
var app = express();
var methodOverride = require("method-override")
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//requring routes
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");
var env = process.env.NODE_ENV || 'development';
// this is not a good way case others will know your info
var mongodb_url = env === 'development' ? "mongodb://localhost/yelp_camp" : process.env.databaseUrl
mongoose.connect(mongodb_url);
mongoose.Promise = global.Promise;
//this is for put and delete
app.use(methodOverride('_method'))
app.use(flash());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSanitizer());
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

// seedDB();
//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "chao develop",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// pass value to all page
app.use(function(req, res, next) {
  //all page will have currentUser when rendered
  res.locals.currentUser = req.user;
  next(); // do not forget!
});


// ROUTER

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("The YelpCamp Server Has Started!");
});