module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log('You are not logged in');
       return res.redirect('/');
    }
    next();
}