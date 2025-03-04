const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine("ejs", ejsMate);

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details[0].message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details[0].message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderers_Hub");
}

main()
    .then(res => {
        console.log("DB connected");
    })
    .catch(err => {
        console.log("DB connection failed");
    })


app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    let newList = new Listing(req.body.listing);
    await newList.save();
    res.redirect("/");
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    res.render("./listings/edit.ejs", { listing });
}));

app.put("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let newList = req.body.listing;
    await Listing.findByIdAndUpdate(req.params.id, { ...newList });
    res.redirect(`/listings/${req.params.id}`);
}));

app.delete("/listings/:id/delete", wrapAsync(async (req, res) => {
    let result = await Listing.findByIdAndDelete(req.params.id, { new: true })
    console.log(result);
    res.redirect("/");
}));

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review saved");
    res.redirect(`/listings/${req.params.id}`)
}));

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occurred" } = err;
    res.status(status).render("error.ejs", { err })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
