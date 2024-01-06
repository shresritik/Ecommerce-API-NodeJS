const Product = require("../models/Product");
const Review = require("../models/Product");
const CustomError = requrie("../errors");
const { checkPermissions } = requrie("../utils");
const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");
const fakeStripeApi = async (amount, current) => {
  const client_secret = "SomeRandomValue";
  return { client_secret, amount };
};
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id: ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "usd",
  });
  const order = await Order.create({
    orderItem,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.client_secret });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No Order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ orders });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No Order with id : ${orderId}`);
  }
  checkPermissions(req.user, irder.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
};
module.exports = {
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  getAllOrders,
  updateOrder,
};
