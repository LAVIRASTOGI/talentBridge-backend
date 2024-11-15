const express = require("express");
const cors = require("cors");
const app = express();
var cookieParser = require("cookie-parser");
//require database
const connectDB = require("./config/database");

const authRouter = require("./user/routes/auth");

//convert JSon object to the js object and add in req again
app.use(express.json());
app.use(cookieParser());
// CORS configuration
app.use(
  cors({
    origin: "*", // Specify the exact origin
    credentials: true, // Allow credentials
  })
);
//Routes
app.use("/api/v1/", authRouter);

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });
