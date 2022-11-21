const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Kanban = require('./models/Kanban');
const Request = require('./models/Request');



// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

// Read JSON files
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);
const kanbans = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/kanbans.json`, 'utf-8')
);

const requests = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/requests.json`, 'utf-8')
);
const orders = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/orders.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
  try {
    await Kanban.create(kanbans);
    await Product.create(products);

    await Order.create(orders);
    await Request.create(requests);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Kanban.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Request.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
