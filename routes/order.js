const express = require("express");

//controllers

const {
  getOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");
const router = express.Router({ mergeParams: true });

// // Includes other resource routers
// const  product = require('./product')
// // Re-Routes into other resource routers
// router.use('/:productId/order', product)

router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);

module.exports = router;
