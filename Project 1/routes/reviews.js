const express = require('express');
const router = express.Router();
const app=express();
const path=require("path");

const wrapAsync = require('../utils/wrapAsync');
var methodOverride = require('method-override');
const {reviewSchema} = require('../schemavalidation');
const {isLoggedIn} = require('../middelware');
const reviewController = require('../controller/reviewController');
const {validateReview} = require('../middelware')




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));

// const validateReview = (req,res,next) => {
//     const {error}= reviewSchema.validate(req.body);
//     if(!error){
//         next();
//     }else{
//         throw  new ExpressError(400,error.message);
//     }
// }


//Post reviews
router.post("/:id/reviews",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//deleting review
router.delete("/:id/reviews/:reviewId",isLoggedIn,wrapAsync(reviewController.deleteReview));


module.exports=router;