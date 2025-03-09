const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isReviewOwner, isLoggedIn, validateReview } = require("../middleware.js");


router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.name=req.user.username;
    listing.reviews.push(newReview);
    newReview.owner = req.user._id;
    await newReview.save();
    await listing.save();
    req.flash("success", "New review added successfully!");
    res.redirect(`/listings/${req.params.id}`)
}));

router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;