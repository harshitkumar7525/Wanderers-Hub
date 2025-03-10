const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(listingController.homePage))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/:id", wrapAsync(listingController.showListing));

router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.editListing));

router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;