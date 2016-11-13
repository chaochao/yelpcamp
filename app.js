var express = require("express");
var path = require('path');
var app = express();
var methodOverride = require("method-override")
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./model/campground");
var Comment = require("./model/Comment");
var User = require("./model/User");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;
//this is for put and delete
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");

app.use(express.static(__dirname+"/public"));

seedDB();
//PASSPORT CONFIG
app.use(require("express-session")({
  secret:"chao develop",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// pass value to all page
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next(); // do not forget!
});


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(e, campgrounds){
    if(e){
      console.log("error: "+e);
      res.status(404).send();
    } else {
      res.render("camp/campgrounds",{campgrounds:campgrounds});
    }
  });
});

app.post("/campgrounds", function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.sanitize(req.body.description);
  var newCampground = {name: name, image: image, description: desc};
  Campground.create(newCampground,function(e,camp){
      if(e){
          console.log("error when store data"+ e);
      } else {
          console.log(camp);
      }
  })
  //redirect back to campgrounds page
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
   res.render("camp/new"); 
});

app.get("/campgrounds/:id", function(req, res){
   // get data by id and then the call bcak send data
   // Campground.findById(req.params.id, function(e, camp){
    Campground.findById(req.params.id).populate("comments").exec(function(e, camp){
    if(e){
      console.log("error load data: "+e);
      res.status(404).send();
    } else {
      res.render("camp/show",{campground: camp});
    } 
   });
});

app.put("/campgrounds/:id", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.sanitize(req.body.description);
  var editCampground = {name: name, image: image, description: desc};
  Campground.findByIdAndUpdate(req.params.id, editCampground, function(e, camp){
    if(e){
      console.log("error load data"+e);
      res.status(404).send();
    } else {
      console.log("this is new? "+camp);
      res.redirect("/campgrounds/"+req.params.id);
    } 
  });
});

app.get("/campgrounds/:id/edit", function(req,res){
   Campground.findById(req.params.id, function(e, camp){
    if(e){
      console.log("error load data"+e);
      res.status(404).send();
    } else {
      res.render("camp/edit",{campground: camp});
    } 
   });
});

app.delete("/campgrounds/:id", function(req, res){
  // res.send("this is delete");
  Campground.findByIdAndRemove(req.params.id,function(e){
    if(e){
      console.log("error load data"+e);
      res.status(404).send();
    } else {
      res.redirect("/campgrounds");
    } 
  });
});
app.get("/campgrounds/:id/comment/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(e, camp){
    if(e){
      console.log("error load data"+e);
      res.status(404).send();
    } else {
      res.render("comment/new",{campground: camp});
    } 
   });
});

app.post("/campgrounds/:id/comment", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(e, camp){
    if(e){
      console.log("error load data"+e);
      res.status(404).send();
    } else {

      Comment.create(req.body.comment,function(e,comment){
        if(e){
          console.log("errro when reate comment");
        } else {
          camp.comments.push(comment);
          camp.save();
          res.redirect("/campgrounds/"+camp.id);
        }
      });
    } 
   });
});

//=========
//AUTH RROUTES
app.get("/register",function(req,res){{
  res.render("register");
}});

app.post("/register",function(req,res){{
  //TODO: some check here.

  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err,user){
    if(err){
      console.log(err);
      return res.render("register"); 
    }
    //log in the user
    passport.authenticate("local")(req,res,function(){
      res.redirect("/campgrounds")
    });
  });
 
}});

app.get("/login",function(req,res){{
  res.render("login");
}});

app.post("/login",passport.authenticate("local", {
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}), function(req,res){{
  res.send("post login");
}});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/campgrounds");
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login");
}

app.listen(process.env.PORT || 3000, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
