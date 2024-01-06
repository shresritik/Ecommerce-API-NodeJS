const express = require("express");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  deleteReview,
  updateReview,
} = requrie("../controller/reviewController.js");
router.route("/").post(authenticateUser, createReview).get(getAllReviews);
router("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);
module.exports = router;
