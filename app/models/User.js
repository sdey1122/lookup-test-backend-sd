const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    salary: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
