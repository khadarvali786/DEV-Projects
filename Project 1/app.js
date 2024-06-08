if(process.env.NODE_ENV != "production"){
  require("dotenv").config()
}

const express = require("express");
const moongse = require("mongoose");
const app = express();
const path = require("path");
const port = 1212;
var methodOverride = require("method-override");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/reviews");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");
const userRoutes = require("./routes/user");


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const DB_URL = process.env.MONGO_ATLAS_DB_URL;

main()
  .then(() => {
    console.log("Conneted to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await moongse.connect(DB_URL);
}

const store = MongoStore.create({
  mongoUrl : DB_URL,
  crypto: {
    secret: 'mycatiswhite'
  },
  touchAfter : 24*3600
  
})

const sessionOption = {
    store,
    secret :"mycatiswhite",
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
});

// app.get("/demouser",async(req,res)=>{
//   let user1={
//     email: "john.c.calhoun@examplepetstore.com",
//     username: "demouser",
//   }
//   let registerUser = await User.register(user1,"Helloworld");
//   res.send(registerUser);
// })

app.use("/listing", listingRoutes);
app.use("/listingreviews", reviewRoutes);
app.use("/auth", userRoutes);

//home page

app.get(
    "/",
    wrapAsync(async (req, res) => {
      // let data1=new Listing({
      //     title:"My New Home",
      //     description:"Come and make chill",
      //     price:600,
      //     location:"Guntur",
      //     country:"India"
      // });
      // await data1.save();
      // console.log("Sample is saved");
      // res.send("Added to db");
      const data = await Listing.find({});
      res.render("HomePage.ejs", { data });
    })
  );

//form to create post
// app.get("/listing/new",(req,res)=>{
//     res.render('NewEntry.ejs');
// });

// //Adding to DataBase
// app.post("/listing/add",validateData,wrapAsync(async(req,res,next)=>{

//     const newListing = new Listing(req.body);
//     await newListing.save();
//     console.log("Added to db");
//     res.redirect("/");

// }));

// //show route
// app.get('/listing/:id', wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const list = await Listing.findById(id).populate("reviews");
//     res.render("show.ejs",{list})
// }));

// //Edit Form
// app.get('/listing/:id/modify',wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     const editData = await Listing.findById(id);
//     res.render('editPost.ejs',{editData});
// }));

// //editing
// app.put("/listing/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body});
//     res.redirect(`/listing/${id}`);
// }));

// //deleting
// app.delete("/listing/:id/delete",wrapAsync( async(req,res)=>{
//     let {id}=req.params;
//     const deletedData=await Listing.findByIdAndDelete(id);
//     console.log(deletedData);
//     res.redirect("/");
// }));

// //Post reviews
// app.post("/listing/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let review = new Review(req.body.review);
//     listing.reviews.push(review);
//     await review.save();
//     await listing.save();
//     res.redirect(`/listing/${listing._id}`);
//     console.log(req.body.review);
// }));

// app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listing/${id}`);
//     console.log(req.params);
// }))

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  if (!statusCode) statusCode = 500;
  if (!message) message = "Sorry an error occurred";
  res.status(statusCode).render("error.ejs", { message });
  console.log(statusCode, message);
});

app.listen(port, (req, res) => {
  console.log(`http://localhost:${port}/`);
});
