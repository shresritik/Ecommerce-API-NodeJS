const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../models/Product");
const path = require("path");
const createProduct = async (req, res) => {
  req.body.user = req.user.userId; //adding user id in req.body.user which was made in Product Schema
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: product.length });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  // here Reviews is not being linked from Product model so we need to use virtual in product model
  const product = await Product.findById({ _id: productId }).populate(
    "reviews"
  );
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Deleted product" });
};
const uploadImage = async (req, res) => {
  // console.log(req.files)
  if (!req.files) {
    throw new CustomError.NotFoundError("No image uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image uploaded");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("Please upload smaller than 1MB");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads." + productImage.name
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `uploads/${productImage.name}` });
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteProduct,
};
