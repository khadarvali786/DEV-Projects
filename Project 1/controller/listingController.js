const Listing = require("../models/listing");
const Review = require("../models/review");
const mapGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_ACCESS_KEY;
const geocodingClient = mapGeoCoding({ accessToken: mapToken });

module.exports.renderNewForm =async(req, res) => {
  let cordinates = await geocodingClient.forwardGeocode({
    query: 'Guntur,india',
    limit: 1
  })
  .send();
  console.log(cordinates.body.features[0].geometry);
    res.render("NewEntry.ejs");
}

module.exports.addingNewListing = async (req, res, next) => { 
  let cordinates = await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
  .send();
  console.log(cordinates.body.features[0].geometry);
   let url = req.file.path;
   let filename = req.file.filename;
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = cordinates.body.features[0].geometry;
    await newListing.save();
    console.log(newListing);
    console.log("Added to db");
    req.flash("success", "Successfully added review");
    res.redirect("/");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    console.log(list);
    if (!list) {
      req.flash("error", "Listing you looking does not exist!");
      res.redirect("/");
    }
    res.render("show.ejs", { list });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const editData = await Listing.findById(id);
    if (!editData) {
      req.flash("error", "Listing you requested to update does not exist!");
      res.redirect("/");
    }
    let originalImage = editData.image.url;
    originalImage = originalImage.replace("/upload","/upload/w_250");
    console.log(originalImage);
    res.render("editPost.ejs", { editData,originalImage });
}

module.exports.editListing = async (req, res) => {
  let cordinates = await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
  .send();
  console.log(cordinates.body.features[0].geometry);
    let { id } = req.params;
    const updatelist = await Listing.findByIdAndUpdate(id, { ...req.body });
    if(typeof(req.file) != "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      updatelist.image = {url,filename};
    }
    updatelist.geometry = cordinates.body.features[0].geometry;
    await updatelist.save();
    if (!updatelist) {
      req.flash("error", "Listing you requested to update does not exist!");
      res.redirect("/");
    }
    req.flash("success", "Successfully Updated the details");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("deleted", "Successfully deleted the details");
    res.redirect("/");
}

module.exports.searchLisiting = async (req,res)=>{

  let {search} = req.query;
  let regex = new RegExp(search, 'gi');
  let searchResult = await Listing.find({ $or: [ { title: regex }]});
//   const results = await Listing.find(
//     { $text: { $search: search } },
//     { score: { $meta: 'textScore' } }
// ).sort({ score: { $meta: 'textScore' } });
let data = searchResult
if(data.length == 0){
  return res.render("datanotfound.ejs");
}

res.render("HomePage.ejs",{data});
}
