const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route PUT /api/users/profile  (update logged-in user's profile)
router.put("/profile", protect, async (req, res) => {
  try {
    const allowedFields = [
      "name", "headline", "skills", "location",
      "companyName", "companyWebsite", "companyDescription",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/users/resume  (candidate uploads/updates default resume on profile)
router.post("/resume", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    req.user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    await req.user.save();
    res.json({ resumeUrl: req.user.resumeUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
