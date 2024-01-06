const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// create Schema
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true, //trims the blank space
      maxlength: [50, "Name cannot be more than 50 chars"],
    },
    price: {
      type: Number,
      required: [true, "Please provide name"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
      trim: true, //trims the blank space
      maxlength: [1000, "Name cannot be more than 50 chars"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide description"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide description"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    //referencing user id User schema
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamp: true,
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);
// virtual connection between Product and Reviews through _id
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match:{rating:5} getting only docs with rating 5
});
//deleting all the reviews associated to that product so when product is removed reviews also removed
ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});
module.exports = mongoose.model("Product", ProductSchema);
