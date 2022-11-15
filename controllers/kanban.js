const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Kanban = require('../models/Kanban')

// @desription: Get all kanbans
// @route: GET /api/v1/kanbans
// @access: public
exports.getKanbans = asyncHandler(async (req, res, next) => {
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
  query = Kanban.find(JSON.parse(queryStr)).populate({
    path: 'requests',
    
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
  const total = await Kanban.countDocuments()
  query = query.skip(startIndex).limit(limit)

  // Executing query
  const kanbans = await query

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
      count: kanbans.length,
      pagination,
      data: kanbans,
    })
})

// @desription: Get a single kanban
// @route: GET /api/v1/kanbans/:id
// @access: public
exports.getKanban = asyncHandler(async (req, res, next) => {
  const kanban = await Kanban.findById(req.params.id)

  if (!kanban) {
    return next(
      new ErrorResponse(
        `Kanban not found with id of ${req.params.id}`,
        404,
      ),
    )
  }
  res.status(201).json({ success: 'true', data: kanban })
})

// @desription: Create a new kanban
// @route: POST /api/v1/kanbans
// @access: public
exports.createKanban = asyncHandler(async (req, res, next) => {
  const kanban = await Kanban.create(req.body)
  res.status(201).json({ success: 'true', data: kanban })
})
// @desription: Update kanban
// @route: POST /api/v1/kanbans/:id
// @access: public
exports.updateKanban = asyncHandler(async (req, res, next) => {
  const kanban = await Kanban.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
  if (!kanban) {
    return next(
      new ErrorResponse(
        `Kanban not found with id of ${req.params.id}`,
        404,
      ),
    )
  }

  res.status(200).json({ success: 'true', data: kanban })
})
// @desription: Delete kanban
// @route: DELETE /api/v1/kanbans/:id
// @access: pivate
exports.deleteKanban = asyncHandler(async (req, res, next) => {
  const kanban = await Kanban.findById(req.params.id)
  if (!kanban) {
    return next(
      new ErrorResponse(`kanban not found with id of ${req.params.id}`, 404),
    )
  }
  kanban.remove()
  res.status(200).json({ success: 'true', data: {} })
})


