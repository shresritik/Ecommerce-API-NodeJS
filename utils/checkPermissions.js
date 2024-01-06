const CustomError = require("../errors");
const checkPermissions = (requestUser, resourceUserId) => {
  //only user and admin can access but other user cannot
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthenticatedError(
    "Not authorized to access this route"
  );
};
module.exports = checkPermissions;
