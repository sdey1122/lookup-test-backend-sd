const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: String,

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    budget: Number,

    status: {
      type: String,
      enum: ["active", "completed"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", projectSchema);
