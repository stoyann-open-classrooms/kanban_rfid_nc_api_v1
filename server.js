// dependency
const path = require('path')
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const fileupload = require("express-fileupload")
//import middlewares
const morgan = require("morgan");
const errorHandler= require('./middlewares/error.js')


// load config DB
const connectDB = require("./config/db");

//load environement variables
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

// Route files
const kanbans = require("./routes/kanbans");
const products = require("./routes/products");
const requests = require("./routes/requests");
const orders = require("./routes/orders");


// initialize express  application
const app = express();

// Body parser
app.use(express.json())

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// File uploading 
app.use(fileupload())

//set static folder 
app.use(express.static(path.join(__dirname, 'public')))

// =============================================== Security ===============================================
// Sanitize data
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
//  Prevents XSS attacks
app.use(xss());

// // Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10mins
  max: 1000,
});
app.use(limiter);

//prevent http param pollution
app.use(hpp());

//Mount routers
app.use("/api/v1/kanbans", kanbans);
app.use("/api/v1/products", products);
app.use("/api/v1/requests", requests);
app.use("/api/v1/orders", orders);


app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT} `.white
      .underline.bold.bgGreen
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
