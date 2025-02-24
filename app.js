const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const Listing = require("./models/listing.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

main()
.then(res => {
    console.log("DB connected");
})
.catch(err => {
    console.log("DB connection failed");
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});

app.get("/",(req,res)=>{
    console.log("Root was accessed");
    res.redirect("/listings");
});


app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    if(allListings){
        res.render("./listings/index.ejs",{allListings});
    }
});