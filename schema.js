const joi = require("joi");
module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        image: joi.string().allow("", null),
        country: joi.string().required(),
        location: joi.string().required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        name: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
});