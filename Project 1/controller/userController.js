const User = require("../models/user");
module.exports.renderSignUpForm = (req,res)=>{
    res.render('users/signup.ejs');
};

module.exports.signUpNewUser = async(req,res,next)=>{
    try {
        let {username,email,password}=req.body;
    let newUser = await User({email,username});
    let registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success",`Succefully Registered. Welcome ${req.user.username}`);
        res.redirect('/');
    })
    
    
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/auth/signup');
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs');
}

module.exports.logInUser = async(req,res)=>{
    req.flash("success",`Succefully Logged In. Welcome ${req.user.username}`);
    let redirectUrl = res.locals.redirectUrl || '/';
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res,next)=>{
    let username = req.user.username
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success",`You Logged Out SuccessFully.Bye Bye `+username);
    res.redirect('/');
    });
    
}