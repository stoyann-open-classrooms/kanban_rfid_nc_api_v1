const express = require("express");
const router = express.Router({ mergeParams: true });
//controllers
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
} = require("../controllers/product");

// // Includes other resource routers
const order = require("./order");
// Re-Routes into other resource routers
router.use("/:productId/orders", order);

router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);
router.route('/:id/photo').put(productPhotoUpload)
module.exports = router;
