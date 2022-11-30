module.exports = (app) => {
  const orders = require("../controllers/order-controller");
  const router = require("express").Router();

  router.post("/add", orders.create);
  router.get("/getall-admin", orders.readAll);
  router.put("/confirm/", orders.confirm);
  router.put("/reject/", orders.reject);
  router.put("/complete/", orders.complete);
  router.get("/getall/:renter_id", orders.readByRenter);
  router.get("/get/:order_id", orders.readOne);

  // Custom url (endpoint)
  app.use("/api/orders", router);
};
