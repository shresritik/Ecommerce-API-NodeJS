require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
//db
const connectDB = require("./db/connect");
//routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
//middleware
const morgan = require("morgan"); //for logging in the terminal
const cookieParser = require("cookie-parser"); //for getting cookies from response to the server
const fileUpload = require("express-fileupload"); //for getting cookies from response to the server
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

app = express();
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("./public"));
app.use(fileUpload());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET)); //cookies is received from res.cookies and is passed to all the pages res.signedCookies is used to //pass the cookies when logged in

PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("Api");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/order", orderRoutes);
app.use(notFound);
app.use(errorHandler);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Listening to ${PORT}`));
  } catch (error) {}
};
start();
