const mongoose = require("mongoose");

const GigsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true, min: 0 },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "assigned"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Gigs = mongoose.model("Gigs", GigsSchema);

module.exports = { Gigs };
