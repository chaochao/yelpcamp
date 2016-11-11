var mongoose = require("mongoose");
var Campground = require("./model/campground");
var Comment = require("./model/Comment");
data = [{
  name: "chao",
  image: "https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg",
  description: "for test"

}, {
  name: "chao2",
  image: "https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg",
  description: "for test"

}, {
  name: "chao3",
  image: "https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg",
  description: "for test"
}]

function seedDB() {
  Campground.remove({}, function(e) {
    if (e) {

    } else {
      data.forEach(function(camp) {
        Campground.create(camp, function(e, camp) {
          if (e) {
            console.log(e);
          } else {
            console.log("create a camp");
            Comment.create({
              text: "it's ok",
              author: "chao"
            },function(e,comment){
              if(e){
                console.log(e);
              } else {
                console.log("create comment");
                camp.comments.push(comment); //not yet work we don't have comments in campground
                camp.save();
              }
            });
            
          }
        })


      })



    }
  });
}
module.exports = seedDB;