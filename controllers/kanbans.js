const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Kanban = require("../models/Kanban");

//@description:     Get all kanbans
//@ route:          GET /v1/kanbans
//@access:          Public
exports.getKanbans = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(req.query);
  queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Kanban.find(JSON.parse(queryStr)).populate('requests');

  const kanbans = await query;
  res
    .status(200)
    .json({ success: true, count: kanbans.length, data: kanbans });
});

//@description:     Get a single kanban
//@ route:          GET /api/v1/kanbans/:id
//@access:          Public
exports.getKanban = asyncHandler(async (req, res, next) => {
  const kanban = await Kanban.findById(req.params.id);
  if (!kanban) {
    return next(
      new ErrorResponse(`kanban not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: kanban });
});

//@description:     Create a kanban
//@ route:          POST /api/v1/kanbans
//@access:          Public
exports.createKanban = asyncHandler(async (req, res, next) => {
  const kanban= await Kanban.create(req.body);
  res.status(201).json({
    success: true,
    data: kanban,
  });
});

//@description:     Update a kanban
//@ route:          PUT /krysto/api/v1/kanbans/:id
//@access:          Public
exports.updateKanban = asyncHandler(async (req, res, next) => {
  const kanban = await Kanban.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!kanban) {
    return next(
      new ErrorResponse(`kanban not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: kanban });
});

//@description:     Delete a kanban
//@ route:          DELETE /api/v1/kanbans/:id
//@access:          Public
exports.deleteKanban = asyncHandler(async (req, res, next) => {
  const kanban = await Kanban.findByIdAndDelete(req.params.id);
  if (!kanban) {
    return next(
      new ErrorResponse(`kanban not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});



