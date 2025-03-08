const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details[0].message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

router.get("/:id", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let newList = new Listing(req.body.listing);
    await newList.save();
    res.redirect("/");
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    res.render("./listings/edit.ejs", { listing });
}));

router.put("/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let newList = req.body.listing;
    await Listing.findByIdAndUpdate(req.params.id, { ...newList });
    res.redirect(`/listings/${req.params.id}`);
}));

router.delete("/:id/delete", wrapAsync(async (req, res) => {
    let result = await Listing.findByIdAndDelete(req.params.id, { new: true })
    console.log(result);
    res.redirect("/");
}));

module.exports = router;

