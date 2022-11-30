const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/profiles/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

module.exports = (app) => {
  const accounts = require("../controllers/account-controller");
  const router = require("express").Router();

  router.post("/login", accounts.getToken);
  router.post("/token", accounts.verifyToken);
  router.post("/register", accounts.create);
  router.post("/upload", upload.single("profile"), accounts.uploadImage);
  router.post("/delimg", accounts.deleteImage);
  router.put("/edit", accounts.update);
  router.delete("/remove", accounts.delete);
  router.get("/image/:profile", accounts.viewImage);
  router.get("/details/:id", accounts.getDetails);

  // Custom url (endpoint)
  app.use("/api/accounts", router);
};
