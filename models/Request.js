const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    kanban: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kanban",
    },
    status: {
      type: String,
      required: true,
      enum: ["a traiter", "archive"],
      default: "a traiter",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
