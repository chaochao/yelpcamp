#YelpCamp

##How to run this project
* npm install
* node app.js
* you need mongodb set up, and run mongod
* npm run watch-css to monitoring scss file
* npm run app // this will run with nodemon

##Initial Setup
* Add Landing Page
* Add Campgrounds Page that lists all campgrounds

Each Campground has:
   * Name
   * Image

#Layout and Basic Styling
* Create our header and footer partials
* Add in Bootstrap

#Creating New Campgrounds
* Setup new campground POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

#Style the campgrounds page
* Add a better header/title
* Make campgrounds display in a grid

#Style the Navbar and Form
* Add a navbar to all templates
* Style the new campground form

#Add Mongoose
* Install and configure mongoose
* Setup campground model
* Use campground model inside of our routes!

#Refactor router
* move campgrounds comments and index into routes folder
* rename some route
* fix bug in seeds.js