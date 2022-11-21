const express = require("express");
// get controller function
const { getOrders, addOrder, getOrder, updateOrder, deleteOrder } = require("../controllers/orders");


const router = express.Router();


router.route("/").get( getOrders).post(addOrder);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);

module.exports = router;


