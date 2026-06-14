const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  skillsToTeach: [
    {
      name: String,
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        default: "Intermediate"
      }
    }
  ],
  skillsToLearn: [String],
  
  // Exchange tracking
  totalExchanges: { type: Number, default: 0 },
  completedExchanges: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      fromUser: mongoose.Schema.Types.ObjectId,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  
  // Points system
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);