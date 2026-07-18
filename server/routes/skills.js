const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getMySkills,
  addSkillToTeach,
  removeSkillToTeach,
  addSkillToLearn,
  removeSkillToLearn,
  updateProfile,
  getAllUsers
} = require("../controllers/skillController");
const { getAIMatch } = require("../controllers/matchController");

router.get("/all", getAllUsers);
router.post("/ai-match", protect, getAIMatch);
router.get("/me", protect, getMySkills);
router.post("/teach", protect, addSkillToTeach);
router.delete("/teach/:skillId", protect, removeSkillToTeach);
router.post("/learn", protect, addSkillToLearn);
router.delete("/learn/:skillName", protect, removeSkillToLearn);
router.put("/profile", protect, updateProfile);

module.exports = router;