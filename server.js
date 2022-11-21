// Dependency
const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./middlewares/error");
const connectDB = require("./config/db");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const path = require('path')
const fileupload = require("express-fileupload")
// connect database
connectDB();
const NODE_ENV = process.env.NODE_ENV;



// Routes files import
const kanban = require("./routes/kanban");
const request = require("./routes/request");
const order = require("./routes/order");
const product = require("./routes/product");

// Express initialisation
const app = express();


// File uploading 
app.use(fileupload())
//set static folder 
app.use(express.static(path.join(__dirname, 'public')))


const PORT = process.env.PORT || 5058;

// Body parser
app.use(express.json());
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}



app.use(express.urlencoded({ extended: false }));





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

// Enable CORS
app.use(cors());

// // cors middleware
app.use(
  cors({
    origin: "*",
  })
);


// Mount routers
app.use("/api/v1/kanbans", kanban);
app.use("/api/v1/requests", request);
app.use("/api/v1/orders", order);
app.use("/api/v1/products", product);

// error handler middlewares
app.use(errorHandler);

//Root URL
app.get("/api/v1", (req, res) => {
  res.status(200).send({ message: `Bienvenue sur l'api kanban V1` });
});

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${NODE_ENV} mode on PORT:   http://localhost:${PORT} ========`
      .white.underline.bold.bgGreen
  )
);
