const express = require("express");
const router = express.Router();
const path = require("path");
const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport");
const { saveRedirectUrl } = require("../middelware");
const app = express();
const userController = require("../controller/userController");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUpNewUser));

// router.get("/signup",userController.renderSignUpForm);

// router.post('/signup',wrapAsync(userController.signUpNewUser));
router.route("/login").get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  userController.logInUser
);

// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/auth/login",failureFlash:true}),userController.logInUser)

router.get("/logout", userController.logoutUser);
module.exports = router;
