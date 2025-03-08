const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 4080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listing = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const sessionKey = require("./passwords.json").sessions;
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine("ejs", ejsMate);

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

const sessionOptions = {
    secret: sessionKey,
    resave: false,
    saveUninitalized: true
}

app.use(session(sessionOptions));
app.use(flash());

app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.use("/listings", listing);
app.use("/listings/:id/reviews", reviews);


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
