const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

const Product = require("../models/Product");

// @desription: Get all products
// @route: GET /api/v1/products
// @access: public
const getProducts = asyncHandler(async (req, res, next) => {
  let query;

  // copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];
  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create a query string
  let queryStr = JSON.stringify(reqQuery);
  // create operators ($gt, $gte, ect .. )
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  //Finding ressources
  query = Product.find(JSON.parse(queryStr)).populate({
    path: "order",
    select: "orderNumber quantity",
  });

  // Select Fields

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();
  query = query.skip(startIndex).limit(limit);

  // Executing query
  const products = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(201).json({
    success: "true",
    count: products.length,
    pagination,
    data: products,
  });
});

// @desription: Get a single product
// @route: GET /api/v1/products/:id
// @access: public
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(
        `Aucun produit trouvée avec l'id : ${req.params.id}`,
        404
      )
    );
  }
  res.status(201).json({ success: "true", data: product });
});

// @desription: Post new product
// @route: GET /api/v1/products
// @access: public

const createProduct = asyncHandler(async (req, res, next) => {
  const { refference, designation, name, stock } = req.body;
  const product = await Product.create({
    name: name,
    refference: refference,
    designation: designation,
    stock: stock,
  });
  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desription: Update product
// @route: POST /api/v1/products/:id
// @access: public
const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: "true", data: product });
});
// @desription: Delete Product
// @route: DELETE /api/v1/products/:id
// @access: public
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  product.remove();
  res.status(200).json({ success: "true", data: {} });
});

// // =========================== UPLOAD IMAGE CONTROLLER ========================================

// @desc      Upload photo for partner
// @route     PUT /api/v1/partners/:id/photo
// @access    Private
const productPhotoUpload = asyncHandler(async (req, res, next) => {
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


module.exports = {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  productPhotoUpload
};
