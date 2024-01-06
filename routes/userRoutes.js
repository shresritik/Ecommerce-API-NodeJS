const express = require("express");
const router = express.Router();
const {
  getAllUser,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require("../controller/userController");
const {
  authenticateUser,
  authorizedPermissions,
} = require("../middleware/authentication");
router
  .route("/")
  .get(authenticateUser, authorizedPermissions("admin", "owner"), getAllUser); //admin or owner is authorized the permssions
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser); //this should be last otherwise everythg after / will take as id params
module.exports = router;
