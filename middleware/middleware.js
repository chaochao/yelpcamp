var Campground = require("../models/campground");

module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },

  isCampgroundOwner: function(req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(e, campground) {
        if (e) {
          console.log("middleware is isSameAuthor err: " + e);
          res.redirect("back")
        } else {
          if (campground.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("/login");
    }
  }
}