const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getMyExchanges,
  sendExchangeRequest,
  acceptExchange,
  sendMessage,
  rateExchange,
  scheduleExchange,
  getUserProfile
} = require("../controllers/exchangeController");

router.get("/user/:userId", getUserProfile);
router.get("/", protect, getMyExchanges);
router.post("/request", protect, sendExchangeRequest);
router.put("/:exchangeId/accept", protect, acceptExchange);
router.post("/:exchangeId/message", protect, sendMessage);
router.post("/:exchangeId/rate", protect, rateExchange);
router.put("/:exchangeId/schedule", protect, scheduleExchange);

module.exports = router;