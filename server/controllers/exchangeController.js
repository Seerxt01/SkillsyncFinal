const Exchange = require("../models/Exchange");
const User = require("../models/User");

// Get all exchanges for logged-in user
const getMyExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [{ initiator: req.user.id }, { recipient: req.user.id }]
    }).populate("initiator recipient", "name email skillsToTeach");

    res.json(exchanges);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send exchange request
const sendExchangeRequest = async (req, res) => {
  try {
    const { recipientId, skillOffered, skillRequested } = req.body;

    if (!recipientId || !skillOffered || !skillRequested) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exchange = new Exchange({
      initiator: req.user.id,
      recipient: recipientId,
      skillOffered,
      skillRequested,
      status: "pending"
    });

    await exchange.save();
    res.status(201).json(exchange);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Accept exchange request
const acceptExchange = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const exchange = await Exchange.findByIdAndUpdate(
      exchangeId,
      { status: "accepted" },
      { new: true }
    );

    if (!exchange) return res.status(404).json({ message: "Exchange not found" });
    res.json(exchange);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send message in exchange
const sendMessage = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const { text } = req.body;

    const exchange = await Exchange.findByIdAndUpdate(
      exchangeId,
      {
        $push: {
          messages: { sender: req.user.id, text }
        }
      },
      { new: true }
    );

    if (!exchange) return res.status(404).json({ message: "Exchange not found" });
    res.json(exchange);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Rate exchange
const rateExchange = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) return res.status(404).json({ message: "Exchange not found" });

    // Check if user is initiator or recipient
    if (exchange.initiator.toString() === req.user.id) {
      exchange.initiatorRating = { rating, comment, createdAt: new Date() };
    } else if (exchange.recipient.toString() === req.user.id) {
      exchange.recipientRating = { rating, comment, createdAt: new Date() };
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }

    await exchange.save();

    // Update user rating
    const otherUserId = exchange.initiator.toString() === req.user.id 
      ? exchange.recipient 
      : exchange.initiator;

    const user = await User.findById(otherUserId);
    user.reviews.push({
      fromUser: req.user.id,
      rating,
      comment
    });
    
    // Calculate average rating
    const avgRating = user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length;
    user.rating = parseFloat(avgRating.toFixed(1));
    await user.save();

    res.json({ exchange, userRating: user.rating });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Schedule exchange
const scheduleExchange = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const { scheduledDate } = req.body;

    const exchange = await Exchange.findByIdAndUpdate(
      exchangeId,
      { scheduledDate },
      { new: true }
    );

    res.json(exchange);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile with rating
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("name email location rating skillsToTeach skillsToLearn reviews points level");

    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyExchanges,
  sendExchangeRequest,
  acceptExchange,
  sendMessage,
  rateExchange,
  scheduleExchange,
  getUserProfile
};