const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Request = require("../models/Request");
const Kanban = require("../models/Kanban");

//@description:     Get requests
//@ route:          GET /api/v1/requests
//@ route:          GET /api/v1/kanban/:kanbanId/requests
//@access:          Public

exports.getRequests = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.kanbanId) {
    query = Request.find({ kanban: req.params.kanbanId }).populate("kanban");
  } else {
    query = Request.find().populate("kanban");
  }
  const requests = await query;
  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

//@description:     Get single request
//@ route:          GET /api/v1/requests/:id
//@access:          Public

exports.getRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id).populate("kanban");

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: request,
  });
});

//@description:     Add request
//@ route:          POST /api/v1/kanban/:kanbanId/requests/
//@access:          Private

exports.addRequest = asyncHandler(async (req, res, next) => {
  req.body.kanban = req.params.kanbanId;

  const kanban = await Kanban.findById(req.params.kanbanId);

  if (!kanban) {
    return next(
      new ErrorResponse(`No kanban with the id of ${req.params.kanbanId}`),
      404
    );
  }
  const request = await Request.create(req.body);

  res.status(200).json({
    success: true,
    data: request,
  });
});

//@description:     Update request
//@ route:          PUT /api/v1/requests/:id
//@access:          Private

exports.updateRequest = asyncHandler(async (req, res, next) => {


  let request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`),
      404
    );
  }
  
  request = await Request.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: request,
  });
});
//@description:     Delete request
//@ route:          DELETE /api/v1/requests/:id
//@access:          Private

exports.deleteRequest = asyncHandler(async (req, res, next) => {


  const request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`),
      404
    );
  }
  await request.remove

  res.status(200).json({
    success: true,
    data: {},
  });
});

