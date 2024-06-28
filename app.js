require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const expressSanitizer = require("express-sanitizer");
const rateLimiter = require("express-rate-limit");

const app = express();

app.set("trust proxy", 1);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration
const allowedOrigins = [
  "https://www.apsui.com",
  "http://localhost:5173",
  "www.apsui.com",
  "localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "*",
    exposedHeaders: "*",
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);

// Ensure that preflight requests are handled
app.options("*", cors());

// Rate limiter
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.use(express.json());
app.use(helmet());
app.use(expressSanitizer());

// Connect to db
const connectDB = require("./db/connnect");

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const galleryRouter = require("./routes/gallery");
const mcqRouter = require("./routes/mcqs");
const fitgRouter = require("./routes/fitg");
const essayqsRouter = require("./routes/essayqs");
const updateRouter = require("./routes/updatestudentproperties");
const questionsRouter = require("./routes/questions");
const birthdayRouter = require("./routes/birthdays");

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/dashboard", profileRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/mcq", mcqRouter);
app.use("/api/v1/fitg", fitgRouter);
app.use("/api/v1/update", updateRouter);
app.use("/api/v1/essayqs", essayqsRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/birthdays", birthdayRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

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