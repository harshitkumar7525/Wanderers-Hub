const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

main()
.then(res => {
    console.log("DB connected");
})
.catch(err => {
    console.log("Connection to failed");
})

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("Data entered successfully");
}

initDB();