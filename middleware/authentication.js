const CustomeError = require("../errors");
const { isTokenValid } = require("../utils");
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token; //token will be in signedCookies because we signed them
  if (!token) {
    throw new CustomeError.UnauthenticatedError("Authentication Invalid");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomeError.UnauthenticatedError("Authentication Invalid");
  }
};
const authorizedPermissions = (...roles) => {
  //middleware needs callback
  return (req, res, next) => {
    //checks whether it is admin or owner
    if (!roles.includes(req.user.role)) {
      throw new CustomeError.UnauthorizedError("Unauthorized error");
    }
    next();
  };
};
module.exports = { authenticateUser, authorizedPermissions };
