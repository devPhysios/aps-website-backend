require("dotenv").config();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const expressSanitizer = require("express-sanitizer");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const path = require("path");
const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 2000,
  })
);
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://unpkg.com",
        "https://cdn.tailwindcss.com/",
        "'unsafe-inline'",
      ],
      styleSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
        "'unsafe-inline'",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
    },
  })
);
app.use(cors());
app.use(expressSanitizer());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Connect to db
const connectDB = require("./db/connect");

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
const alumniRouter = require("./routes/alumnus");
const leadersRouter = require("./routes/leaders");

// Import the birthday controller
const {
  getStudentBirthdaysByMatricNumberForEjs,
} = require("./controllers/birthdays");

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
app.use("/api/v1/alumni", alumniRouter);
app.use("/api/v1/leaders", leadersRouter);

// Birthday route to render EJS template
app.get("/birthday/:matricNumber", async (req, res) => {
  try {
    const birthdayData = await getStudentBirthdaysByMatricNumberForEjs(
      req,
      res
    );
    if (birthdayData) {
      res.render("birthday", { birthday: birthdayData });
    } else {
      // Set a 404 status and render an error page with a redirect script
      res.status(404).render("error", {
        message: "Birthday not found",
        redirectUrl: "https://www.apsui.com/birthdays", // Replace with your desired external URL
        redirectDelay: 3000 // 3 seconds in milliseconds
      });
    }
  } catch (error) {
    // Set a 500 status and render an error page with a redirect script
    res.status(500).render("error", {
      message: "Error fetching birthday data",
      redirectUrl: "https://www.apsui.com/birthdays", // Replace with your desired external URL
      redirectDelay: 3000 // 3 seconds in milliseconds
    });
  }
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
