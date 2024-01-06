const CustomeError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomeError.BadRequestError("Email Already Exists");
  }
  //first user then set it as admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role });
  // setting token on cookies
  const tokenUser = createTokenUser(user);
  const token = attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomeError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomeError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomeError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  const token = attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ token, user: tokenUser });
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expire: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: `user logged out` });
};
module.exports = { register, login, logout };
