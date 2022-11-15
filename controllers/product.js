const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// image Upload dependence

const multer = require("multer");
const path = require("path");


const Product = require('../models/Product')

// @desription: Get all products
// @route: GET /api/v1/products
// @access: public
const getProducts= asyncHandler(async (req, res, next) => {
  let query

  // copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']
  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // create a query string
  let queryStr = JSON.stringify(reqQuery)
  // create operators ($gt, $gte, ect .. )
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  //Finding ressources
  query = Product.find(JSON.parse(queryStr)).populate({
    path: 'order',
    select: 'orderNumber quantity',
  })

  // Select Fields

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Product.countDocuments()
  query = query.skip(startIndex).limit(limit)

  // Executing query
  const products = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res
    .status(201)
    .json({
      success: 'true',
      count: products.length,
      pagination,
      data: products,
    })
})

// @desription: Get a single product
// @route: GET /api/v1/products/:id
// @access: public
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(
      new ErrorResponse(
        `Aucun produit trouvée avec l'id : ${req.params.id}`,
        404,
      ),
    )
  }
  res.status(201).json({ success: 'true', data: product })
})



// @desription: Post new product
// @route: GET /api/v1/products
// @access: public

const createProduct = asyncHandler(async (req, res, next) => {
  const { refference, designation, name, stock } = req.body
  const product = await Product.create({
    image : req.file.path,
    name: name,
    refference: refference,
    designation: designation,
    stock: stock,
  })
  res.status(201).json({
    success: true,
    data: product,
  })
})




// @desription: Update product
// @route: POST /api/v1/products/:id
// @access: public
const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with id of ${req.params.id}`,
        404,
      ),
    )
  }



  res.status(200).json({ success: 'true', data: product })
})
// @desription: Delete Product
// @route: DELETE /api/v1/products/:id
// @access: public
const deleteProduct = asyncHandler(async (req, res, next) => {
  const  product = await Product.findById(req.params.id)
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404),
    )
  }
  product.remove()
  res.status(200).json({ success: 'true', data: {} })
})



// // =========================== UPLOAD IMAGE CONTROLLER ========================================

const im = "product_";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload");
  },
  filename: (req, file, cb) => {
    cb(null, im + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Le fichier doit être au format JPG , JPEG , PNG ou GIF");
  },
}).single("image");


module.exports = {
  getProduct,
  upload,
  getProducts,
  createProduct, 
  deleteProduct,
  updateProduct
   
 }