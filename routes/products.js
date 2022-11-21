
const express = require("express");
// get controller function
const { getProducts, createProduct, getProduct, updateProduct, deleteProduct , productPhotoUpload } = require("../controllers/products");

// Includes other ressource routers
const requestRouter = require('./requests')
const kanbanRouter = require('./kanbans')
const router = express.Router();

// Re-route into other ressource router  
router.use('/:productId/requests', requestRouter)
router.use('/:productId/kanbans', kanbanRouter)


router.route("/").get( getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);
router.route('/:id/photo').put(productPhotoUpload)

module.exports = router;