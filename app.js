const express = require("express");
require("dotenv").config();
require("express-async-errors");
const rateLimitter = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const connectDB = require("./db/connect");
const authMiddleware = require("./middleware/authentication");

app.use(express.json());

// security setup
app.use(
  rateLimitter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
