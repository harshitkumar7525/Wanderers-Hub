const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
    let coordinates = await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1
    })
    .send();
    let url = req.file.path;
    let filename = req.file.filename;
    let newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename };
    newList.geometry = coordinates.body.features[0].geometry;
    await newList.save();
    req.flash("success", "New listing added successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let OriginalUrl = listing.image.url;
    OriginalUrl = OriginalUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listing, OriginalUrl });
};

module.exports.editListing = async (req, res) => {
    let listing = await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save()
    }
    req.flash("success", "Listing edited successfully!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyListing = async (req, res) => {
    let result = await Listing.findByIdAndDelete(req.params.id, { new: true })
    console.log(result);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/");
};