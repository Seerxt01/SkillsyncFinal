const User = require("../models/User");

// ── GET my skills ─────────────────────────────────────────
const getMySkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email skillsToTeach skillsToLearn location bio");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADD a skill to teach ──────────────────────────────────
const addSkillToTeach = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name) return res.status(400).json({ message: "Skill name required" });

    const user = await User.findById(req.user.id);

    const exists = user.skillsToTeach.find(
      s => s.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return res.status(400).json({ message: "Skill already added" });

    user.skillsToTeach.push({ name, level: level || "Intermediate" });
    await user.save();

    res.json({ message: "Skill added", skillsToTeach: user.skillsToTeach });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── REMOVE a skill to teach ───────────────────────────────
const removeSkillToTeach = async (req, res) => {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.user.id);

    user.skillsToTeach = user.skillsToTeach.filter(
      s => s._id.toString() !== skillId
    );
    await user.save();

    res.json({ message: "Skill removed", skillsToTeach: user.skillsToTeach });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADD a skill to learn ──────────────────────────────────
const addSkillToLearn = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Skill name required" });

    const user = await User.findById(req.user.id);

    if (user.skillsToLearn.includes(name.toLowerCase())) {
      return res.status(400).json({ message: "Skill already added" });
    }

    user.skillsToLearn.push(name);
    await user.save();

    res.json({ message: "Skill added", skillsToLearn: user.skillsToLearn });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── REMOVE a skill to learn ───────────────────────────────
const removeSkillToLearn = async (req, res) => {
  try {
    const { skillName } = req.params;
    const user = await User.findById(req.user.id);

    user.skillsToLearn = user.skillsToLearn.filter(
      s => s !== skillName
    );
    await user.save();

    res.json({ message: "Skill removed", skillsToLearn: user.skillsToLearn });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── UPDATE bio and location ───────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { bio, location } = req.body;
    const user = await User.findById(req.user.id);

    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET all users ──────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email location rating skillsToTeach skillsToLearn");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMySkills,
  addSkillToTeach,
  removeSkillToTeach,
  addSkillToLearn,
  removeSkillToLearn,
  updateProfile,
  getAllUsers
};