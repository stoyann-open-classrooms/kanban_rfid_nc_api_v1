const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

const Order = require('../models/Order')
const Product = require('../models/Product')

// @desription: Get Orders
// @route: GET /api/v1/orders
// @access: public
exports.getOrders = asyncHandler(async (req, res, next) => {
  let query

  if (req.params.productId) {
    query = Order.find({ product: req.params.productId }).populate({
      path: 'product',
      select: 'refference designation image',
    })
  } else {
    query = Order.find().populate({
      path: 'product',
      select: 'refference designation image',
    })
  }

  const orders = await query
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  })
})
// @desription: Get a single order
// @route: GET /api/v1/orders/:id
// @access: public
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'product',
    select: 'refference designation',
  })
  if (!order) {
    return next(
      new ErrorResponse(
        ` ❌ Request not found with id of ${req.params.id}`,
        404,
      ),
    )
  }
  res.status(201).json({ success: 'true', data: order })
})

// @desription: Create a new order
// @route: POST /api/v1/order
// @access: public
exports.createOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.create(req.body)
  res.status(201).json({ success: 'true', data: order })
})
// @desription: Update Request
// @route: POST /api/v1/requests/:id
// @access: public
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!order) {
    return next(
      new ErrorResponse(
        `❌ Order not found with id of ${req.params.id}`,
        404,
      ),
    )
  }

  res.status(200).json({ success: 'true', data: order })
})
// @desription: Delete order
// @route: DELETE /api/v1/order/:id
// @access: public
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return next(
      new ErrorResponse(
        `❌ Order not found with id of ${req.params.id}`,
        404,
      ),
    )
  }
  order.remove()
  res.status(200).json({ success: 'true', data: {} })
})
