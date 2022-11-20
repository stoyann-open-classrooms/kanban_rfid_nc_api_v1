const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
    slug: String,
    image: {
      type: String,
      required: [true, "Vous devez ajouter une image pour ce produit"],
      default: "public\\upload\\no_picture.png",
    },
    name: {
      type: String,
      required: [true, "Merci d'entrer un nom de produit"],
      trim: true,
      maxlength: [50, "Le nom doit contenir au maximum 50 caractères"],
    },
    designation: {
      type: String,
      required: [true, "Merci d'entrer une designation produit"],
      trim: true,
      maxlength: [500, "Le nom doit contenir au maximum 50 caractères"],
    },
    refference: {
      type: String,
      required: [true, "Merci d'entrer une refference"],
      unique: true,
      trim: true,
      maxlength: [10, "La refference doit contenir au maximum 10 caractères"],
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create  product slug from the product name
ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
