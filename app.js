const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const session = require("express-session");
const sessionKey = require("./passwords.json").sessions;
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const asyncWrap = require("./utils/wrapAsync.js");
const userRouter = require("./routes/users.js");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine("ejs", ejsMate);

const sessionOptions = {
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", asyncWrap(async (req, res) => {
    let demo = new User({
        email: "student@email.com",
        username: "example"
    })
    let registeredUser = await User.register(demo, "examplepass");
    res.send(registeredUser);
}));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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
