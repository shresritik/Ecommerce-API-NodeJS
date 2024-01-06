const express = require("express");
const {
  authenticateUser,
  authorizedPermissions,
} = require("../middleware/authentication");
const router = express.Router();
const {
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
  getAllOrders,
} = require("../controller/orderController");
const { model } = require("mongoose");
router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizedPermissions("admin"), getAllOrders);
rotuer.route("/showAllMyOrders").get(auth);
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);
module.exports = router;
