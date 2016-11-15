var Campground = require("../models/campground");

module.exports ={
  isLoggedIn: function (req, res, next){
    console.log("this is isLoggedIn");
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
  },

  isCampgroundOwner: function (req,res,next){
    if(req.isAuthenticated()){
      console.log("is auth");
      Campground.findById(req.params.id, function(e,campground){
        if(e){
          console.log("middleware is isSameAuthor err: "+e);
           res.redirect("/campgrounds")
        } else{
          if(req.user._id === campground.author.id){
             next();      
          } else {
             res.redirect("/campgrounds");
          }
        }
      });
    }else {
      res.redirect("/login");  
    }
  }
}