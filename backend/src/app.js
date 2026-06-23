const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Student registry API is running",
  });
});

app.use("/api/students", studentRoutes);

app.use(errorHandler);

module.exports = app;