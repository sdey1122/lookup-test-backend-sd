require("dotenv").config();
const express = require("express");
const connectDB = require("./app/config/db");
const aggregationRoutes = require("./app/routes/aggregationRoutes");
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MongoDB Aggregation API Running",
  });
});
app.use("/api/aggregation", aggregationRoutes);

const PORT = process.env.PORT || 4999;

app.listen(PORT, () => {
  console.log(`MGDB Aggregation server running on port ${PORT}`);
});
