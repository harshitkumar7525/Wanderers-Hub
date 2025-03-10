const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUpUser));

router.route("/login")
    .get(userController.renderLogInForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.logInUser));

router.get("/logout", userController.logOutUser);

module.exports = router;