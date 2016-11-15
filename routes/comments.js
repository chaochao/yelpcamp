var express = require("express");
var router = express.Router({
  mergeParams: true
});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/middleware");
//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  // find campground by id
  // console.log(req.params.id);
  // console.log(req.user);
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        campground: campground,
        user: req.user
      });
    }
  })
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          //push user info inoto comment
          comment.author.username = req.user.username;
          comment.author.id = req.user._id;
          comment.save(); // remember save it !
          //push comment into campground
          campground.comments.push(comment);
          campground.save();
          // console.log(comment);
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// get edit page
router.get("/:comment_id/edit", middleware.isCommentOwner, function(req, res) {
  Campground.findById(req.params.id, function(e, campground) {
    if (e) {
      console.log(e);
      res.redirect("back");
    } else {
      Comment.findById(req.params.comment_id, function(e, comment) {
        if (e) {
          console.log(e);
          res.redirect("back");
        } else {
          console.log(comment);
          res.render("comments/edit", {
            campground: campground,
            comment: comment
          });
        }
      });
    }
  });
});
// edit put
router.put("/:comment_id", middleware.isCommentOwner, function(req, res) {

  var commentText = {
    text: req.body.comment.text
  }
  Comment.findByIdAndUpdate(req.params.comment_id, commentText, function(e, comment) {
    if (e) {
      console.log(e);
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });

});

//delete
router.delete("/:comment_id", middleware.isCommentOwner, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(e) {
    if (e) {
      console.log("error load data" + e);
      res.status(404).send();
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});



module.exports = router;