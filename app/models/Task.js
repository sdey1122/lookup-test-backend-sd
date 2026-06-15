const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
    },

    hoursWorked: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);
