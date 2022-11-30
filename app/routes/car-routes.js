const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/cars/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

module.exports = (app) => {
  const cars = require("../controllers/car-controller");
  const router = require("express").Router();

  router.post("/add", cars.create);
  router.get("/getall", cars.readAll);
  router.get("/get/:id", cars.readOne);
  router.get("/image/:image", cars.viewImage);

  // Custom url (endpoint)
  app.use("/api/cars", router);
};
