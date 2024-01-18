require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

app.set("trust proxy", 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//connect to db
const connectDB = require("./db/connnect");

// routers


// error handler

// routes



const port = process.env.PORT || 8800;

const startConnection = async () => {
  try {
    const isConnectionSuccessful = await connectDB(process.env.MONGO_URI); // Wait for the connection to complete

    if (isConnectionSuccessful) {
      app.listen(
        port,
        console.log(
          `Connection to the Database Successful. Server is listening on port ${port}`
        )
      );
    } else {
      console.log("Connection Failed");
    }
  } catch (error) {
    console.log(error);
  }
};

startConnection();

