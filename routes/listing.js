const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
var methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { listingSchema } = require("../schemavalidation");
const { isLoggedIn, isOwner } = require("../middelware");
const listingController = require("../controller/listingController");
const multer  = require('multer')
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const validateData = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
};
//form to create post
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Adding to DataBase
router.post(
  "/add",
  isLoggedIn,
  upload.single('image'),
  validateData,
  wrapAsync(listingController.addingNewListing)
);

router
  .route("/:id")
  .get(
    wrapAsync(listingController.showListing)
  )
  .put(
    isLoggedIn,
    isOwner,
    upload.single('image'),
    validateData,
    wrapAsync(listingController.editListing)
  );
// //show route
// router.get("/:id", wrapAsync(listingController.showListing));

//Edit Form
router.get(
  "/:id/modify",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// //editing
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateData,
//   wrapAsync(listingController.editListing)
// );

//deleting
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

router.get("/search/data",listingController.searchLisiting)

module.exports = router;
