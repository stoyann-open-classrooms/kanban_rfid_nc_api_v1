const mongoose = require('mongoose')



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected with success !! connection host: ${conn.connection.host}`.white.underline.bold.bgCyan)
  } catch (error) {
    console.log(` !!! Error !!!  =>  ${error.message}`.red.underline.bold.bgWhite)
    process.exit(1)
  }
}

module.exports = connectDB
