const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isReviewOwner, isLoggedIn, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createNewReview));

router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.destroyReview));

module.exports = router;