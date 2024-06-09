if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
const express=require('express');
const moongse=require('mongoose');
const app=express();
const path=require("path");
const port = 8080;
const Listing=require("./models/dsamodel");
const User = require("./models/userModel");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const {isLoggedIn} = require("./middelware");


app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "/public")));


const MONGO_URL=process.env.MONGO_DB_URL

main()
.then(()=>{
    console.log("Conneted to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await moongse.connect(MONGO_URL);
}
const store = MongoStore.create({
    mongoUrl : MONGO_URL,
    crypto: {
      secret: process.env.SECRET
    },
    touchAfter : 24*3600
    
  })
const sessionOption = {
    store,
    secret :process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.deleted = req.flash('deleted');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})



// app.get("/getdata",async(req,res)=>{
//     let data1=new Listing({
//         title:"My New Home",
//         description:"Come and make chill",
//         price:600,
//         location:"Guntur",
//         country:"India"
//     });
//     await data1.save();
//     console.log("Sample is saved");
//     res.send("Added to db");
// })

app.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect("/dsa");
    }
    res.render("landingPage.ejs");
})

app.get("/dsa",isLoggedIn,async(req,res)=>{
    const data=await Listing.find();
   // console.log(data);
    res.render('HomePage.ejs',{data});
});


app.post("/dsa/signup",async(req,res)=>{
    try {
        let {username,email,password}=req.body;
        let newUser = await User({email,username});
        let registeredUser = await User.register(newUser,password);
        // console.log(registeredUser);
        // console.log("success","You are registered");
        res.redirect("/");
    } catch (error) {
        console.log('error',error.message);
        res.redirect('/');
    }
});

app.post("/dsa/login",passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: true,
  }),async(req,res)=>{
   req.flash("success","Susccessfully loggedin");
    res.redirect("/dsa");
})
app.get("/dsa/:id",isLoggedIn,async(req,res)=>{
    let {id}=req.params;
    const questions=await Listing.find({topicName:id});
   console.log(questions);
    res.render('questionsPage.ejs',{questions});
});

app.get("/logout",(req,res,next)=>{
    let username = req.user.username
    req.logout((err)=>{
        if(err){
            req.flash("error",err.message)
        }
        req.flash("success",`You Logged Out SuccessFully.Bye Bye `+username);
        res.redirect('/');
    });
})


app.listen(port,(req,res)=>{
    console.log(`http://localhost:${8080}/\n Successfully Running`);
});