var mongoose = require("mongoose");

// Schema Set up
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author:{
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      username: String
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);


// var mongoose     = require("mongoose");

// // SCHEMA SETUP
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String,
//     comments: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Comment"
//         }
//     ]
// });

// var Campground = mongoose.model('Campground', campgroundSchema);

// module.exports = Campground;
