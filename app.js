const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine("ejs",ejsMate);

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

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});

app.get("/",(req,res)=>{
    res.redirect("/listings");
});


app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    if(allListings){
        res.render("./listings/index.ejs",{allListings});
    }else{
        err=null;
        res.render("error.ejs",{err})
    }
});

app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

app.get("/listings/:id",async (req,res)=>{
    let data = await Listing.findById(req.params.id);
    if(data){
        res.render("./listings/show.ejs",{data});
    } else {
        res.send("No data");
    }
});

app.post("/listings",(req,res)=>{
    let newList = new Listing(req.body);
    newList.save()
    .then(result => {
        console.log(result);
        res.redirect("/")
    })
    .catch(err =>{
        res.render("error.ejs",{err});
    })
});

app.get("/listings/:id/edit",(req,res)=>{
    Listing.findById(req.params.id)
    .then((listing) => {
        res.render("./listings/edit.ejs",{listing});
    })
    .catch(err => {
        res.render("error.ejs",{err});
    })
});

app.put("/listings/:id/edit",async (req,res)=>{
    let newList = req.body.listing;
    newList.description = newList.description.toString().trim();
    let result = await Listing.findByIdAndUpdate(req.params.id,newList);
    if(result){
        res.redirect(`/listings/${req.params.id}`);
    }
    else{
        res.render("error.ejs",{result})
    }
});

app.delete("/listings/:id/delete",(req,res)=>{
    Listing.findByIdAndDelete(req.params.id,{new:true})
    .then(result => {
        console.log(result);
        res.redirect("/");
    })
    .catch(err =>{
        res.render("error.ejs",{err});
    })
});