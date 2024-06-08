const Listing = require("./models/listing");
const ExpressError = require('./utils/ExpressError');
const {reviewSchema} = require('./schemavalidation');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash('error','You must be logged in to do that!')
        return res.redirect("/auth/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this Listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const {error}= reviewSchema.validate(req.body);
    if(!error){
        next();
    }else{
        throw  new ExpressError(400,error.message);
    }
}