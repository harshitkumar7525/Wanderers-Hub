const { ref } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;