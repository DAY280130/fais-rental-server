const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conf = process.env;
const db = require("./app/models/");
const port = conf.API_PORT;

db.mongoose
  .connect(conf.MONGO_HOST + "/" + conf.MONGO_DB_NAME + "?" + conf.MONGO_CONN_PARAMS)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Cannot connect to database", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API OK!",
  });
});

// routes list
require("./app/routes/account-routes")(app);
require("./app/routes/car-routes")(app);
require("./app/routes/order-routes")(app);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
