var express = require("express");
var app = express();
var methodOverride = require("method-override")
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./model/campground");
var expressSanitizer = require("express-sanitizer");
mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;
//this is for put and delete
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");

// var campSchema = new mongoose.Schema({
//   name: String,
//   image: String,
//   description: String
// });

// var Campground = mongoose.model("Cat",campSchema);//create "table"
   
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(e, campgrounds){
    if(e){
      console.log("error: "+e);
      res.status(404).send();
    } else {
      res.render("campgrounds",{campgrounds:campgrounds});
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
   res.render("new.ejs"); 
});

app.get("/campgrounds/:id", function(req, res){
   // get data by id and then the call bcak send data
   Campground.findById(req.params.id, function(e, camp){
    if(e){
      console.log("error load data: "+e);
      res.status(404).send();
    } else {
      res.render("show.ejs",{campground: camp});
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
      res.render("edit.ejs",{campground: camp});
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

app.listen(process.env.PORT || 3000, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
