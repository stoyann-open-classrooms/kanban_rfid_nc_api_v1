const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Request = require("../models/Request");

//@description:     Get orders
//@ route:          GET /api/v1/orders
//@ route:          GET api/v1/products/:productId/orders
//@access:          Public

exports.getOrders = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.productId) {
    query = Order.find({ product: req.params.productId }).populate({
      path: "product",
      select: "name, refference",
    });
  } else {
    query = Order.find().populate({
      path: "product",
      select: "name refference",
    });
  }
  const orders = await query;
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

//@description:     Get single order
//@ route:          GET /api/v1/orders/:id
//@access:          Public

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: "product",
    select: "name, description, refference",
  });

  if (!order) {
    return next(
      new ErrorResponse(`No order found with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

//@description:     Add order
//@ route:          POST /api/v1/products/:productId/orders/
//@access:          Public

exports.addOrder = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
 

  const product = await Product.findById(req.params.productId);
  

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.productId}`),
      404
    );
  }

  const order = await Order.create(req.body);

  res.status(200).json({
    success: true,
    data: order,
  });
});

//@description:     Update order
//@ route:          PUT /api/v1/collects/:id
//@access:          Public

exports.updateOrder = asyncHandler(async (req, res, next) => {


  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No order with the id of ${req.params.id}`),
      404
    );
  }
  
  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: order,
  });
});
//@description:     Delete order
//@ route:          DELETE /api/v1/orders/:id
//@access:          Private

exports.deleteOrder = asyncHandler(async (req, res, next) => {


  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No order with the id of ${req.params.id}`),
      404
    );
  }
  await order.remove

  res.status(200).json({
    success: true,
    data: {},
  });
});

