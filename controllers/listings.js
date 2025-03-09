const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

module.exports.homePage = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "owner"
            }
        })
        .populate("owner");
    console.dir(listing);
    if (!listing) {
        req.flash("error", "Requested Listing cannot be found");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    await newList.save();
    req.flash("success", "New listing added successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    res.render("./listings/edit.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
    let newList = req.body.listing;
    await Listing.findByIdAndUpdate(req.params.id, { ...newList });
    req.flash("success", "Listing edited successfully!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyListing = async (req, res) => {
    let result = await Listing.findByIdAndDelete(req.params.id, { new: true })
    console.log(result);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/");
};