const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log error to console for a developer
  console.log(`${err}`.red.bgWhite);

  // Mongoose bad object ID
  if (err.name === "CastError") {
    const message = `⛔️ Ressource not found with id of ${err.value} ⛔️`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose dupplicate Keys
  if (err.code === 11000) {
    const message = `⚠️ Dupplicate field value entered ⚠️`;
    error = new ErrorResponse(message, 400);
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = `⚠️ ${Object.values(err.errors)} ⚠️`;
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
