const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

// models list
db.accounts = require("./account-model")(mongoose);
db.cars = require("./car-model")(mongoose);
db.orders = require("./order-model")(mongoose);

module.exports = db;
