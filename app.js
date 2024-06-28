require("dotenv").config();

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const expressSanitizer = require("express-sanitizer");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

const allowedOrigins = [
  "https://www.apsui.com",
  "http://localhost:5173",
  "www.apsui.com",
  "localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array or if it's undefined (for server-to-server requests without origin header)
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "*", // Allow all headers
    exposedHeaders: "*", // Expose all headers
    credentials: true, // Allow credentials
    maxAge: 86400, // Cache preflight response for 24 hours
    optionsSuccessStatus: 200, // Return 200 for successful OPTIONS requests
    preflightContinue: false, // Do not pass the CORS preflight response to the next handler
  })
);

// Ensure that preflight requests are handled
app.options("*", cors());

app.use(express.json());
app.use(helmet());
app.use(expressSanitizer());

//connect to db
const connectDB = require("./db/connnect");

// routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const galleryRouter = require("./routes/gallery");
const mcqRouter = require("./routes/mcqs");
const fitgRouter = require("./routes/fitg");
const essayqsRouter = require("./routes/essayqs");
const updateRouter = require("./routes/updatestudentproperties");
const questionsRouter = require("./routes/questions");
const birthdayRouter = require("./routes/birthdays");

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/dashboard", profileRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/mcq", mcqRouter);
app.use("/api/v1/fitg", fitgRouter);
app.use("/api/v1/update", updateRouter);
app.use("/api/v1/essayqs", essayqsRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/birthdays", birthdayRouter);

const port = process.env.PORT || 8800;

const startConnection = async () => {
  try {
    const isConnectionSuccessful = await connectDB(process.env.MONGO_URI);

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
