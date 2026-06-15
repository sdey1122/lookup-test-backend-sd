const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Department", departmentSchema);
