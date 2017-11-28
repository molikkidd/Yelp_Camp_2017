var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - Show all campgrounds
router.get("/", function(req,res){

    // Get all campgrounds from DB then render the file
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else { 
            res.render("campgrounds/index", {campgrounds: allCampgrounds });
        }
        });
    
});

// CREATE -add new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name , price:price, image:image, description:desc, author:author}
    // create a new campground and save to DB
    Campground.create (newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else { 
            console.log(newlyCreated);
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
});

// NEW - Display form to make new dog
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows info about one dog
router.get("/:id", function(req,res){
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
            console.log(err)
        } else {
             // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// edit campground 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
   
});

// update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    // find and update by id
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err){
            res.redirect("/campground");
        } else {
            // redirect back to show page
             res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
    
// delete campgrounds

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, deleteCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
         
         Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("/campgrounds");
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                   next(); 
                } else {
                    res.redirect("back");
                }
            } 
    });
        } else {
            res.redirect("back");
        }
   
}
module.exports = router;