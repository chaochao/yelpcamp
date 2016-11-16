var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/middleware");
//INDEX - show all campgrounds
router.get("/", function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        message: req.flash("error")
      });
    }
  });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
      res.status(404).send();
    } else {
      // console.log(foundCampground)
      //render show template with that campground
      res.render("campgrounds/show", {
        campground: foundCampground,
        currentUser: req.user,
        message: req.flash("error")
      });
    }
  });
});

router.get("/:id/edit", middleware.isCampgroundOwner, function(req, res) {
  Campground.findById(req.params.id, function(e, camp) {
    if (e) {
      console.log("error load data" + e);
      res.status(404).send();
    } else {
      res.render("campgrounds/edit", {
        campground: camp
      });
    }
  });
});

router.put("/:id", middleware.isCampgroundOwner, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(e, camp) {
    if (e) {
      console.log("error load data" + e);
      res.redirect("/campgrounds")
    } else {
      // console.log("this is new? " + camp);
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// only authoer can remove the item
router.delete("/:id", middleware.isCampgroundOwner, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(e) {
    if (e) {
      console.log("error load data" + e);
      res.status(404).send();
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {
      name: name,
      image: image,
      author: author,
      description: desc
    }
    // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;