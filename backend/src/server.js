const app = require("./app");
const { testDatabaseConnection } = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testDatabaseConnection();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();