const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  skillOffered: String,
  skillRequested: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending"
  },
  messages: [
    {
      sender: mongoose.Schema.Types.ObjectId,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  scheduledDate: Date,
  initiatorRating: {
    rating: Number,
    comment: String,
    createdAt: Date
  },
  recipientRating: {
    rating: Number,
    comment: String,
    createdAt: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Exchange", exchangeSchema);