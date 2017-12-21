var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose= require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost/yelp_camp_v10");
mongoose.connect("mongodb://kilom:sword@ds163226.mlab.com:63226/visionboard_1");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// passport configuration
app.use(require("express-session")({
    secret:"PROGRESS",
    resave: false,
    saveUninitialized: false 
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yezzir Server has Sharted");
});