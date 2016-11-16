var Campground = require("../models/campground");
var Comment = require("../models/comment");

module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  },

  isCampgroundOwner: function(req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(e, campground) {
        if (e) {
          console.log("middleware is isCampgroundOwner err: " + e);
          req.flash("error", "Something wrong when try to find the campground.");
          res.redirect("/campgrounds/" + req.params.id);
        } else {
          if (campground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have the permission!");
            res.redirect("/campgrounds/" + req.params.id);
          }
        }
      });
    } else {
      req.flash("error", "Please Login First!");
      res.redirect("/login");
    }
  },
  isCommentOwner: function(req,res,next){
    if (req.isAuthenticated()) {
      //find comment and compare the author
      Comment.findById(req.params.comment_id, function(e, comment){
        if(e){
          console.log("middleware isCommentOwner err: "+ e);
          res.redirect("back");
        } else{
          if (comment.author.id.equals(req.user._id)){
            next();
          } else{
            req.flash("error", "You don't have the permission!");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "Please Login First!");
      res.redirect("/login");
    }
  }
}