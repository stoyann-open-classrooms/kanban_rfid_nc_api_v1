const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Product = require("../models/Product");

//@description:     Get all products
//@ route:          GET /api/v1/products
//@access:          Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(req.query);
  queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Product.find(JSON.parse(queryStr)).populate('order');

  const partners = await query;
  res
    .status(200)
    .json({ success: true, count: partners.length, data: partners });
});

//@description:     Get a single product
//@ route:          GET /api/v1/products/:id
//@access:          Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: product });
});

//@description:     Create a product
//@ route:          POST api/v1/product
//@access:          Public
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    data: product,
  });
});

//@description:     Update a product
//@ route:          PUT /api/v1/products/:id
//@access:          Public
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: product });
});

//@description:     Delete a product
//@ route:          DELETE /api/v1/product/:id
//@access:          Public
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});





// // =========================== UPLOAD IMAGE CONTROLLER ========================================

// @desc      Upload photo for product
// @route     PUT /api/v1/products/:id/photo
// @access    Public
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }


  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.image;
  
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${product._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Product.findByIdAndUpdate(req.params.id, { image: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});