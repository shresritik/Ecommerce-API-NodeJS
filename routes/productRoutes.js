const express = require("express");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteProduct,
} = require("../controller/productController");
const { getSingleProductReviews } = require("../controller/reviewController");
router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createProduct)
  .get(getAllProducts);
router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage);
router
  .route("/:id", getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct);
router.route("/:id/reviews").get(getSingleProductReviews);
module.exports = router;
