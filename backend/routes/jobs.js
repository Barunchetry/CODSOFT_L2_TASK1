const express = require("express");
const { body, validationResult } = require("express-validator");
const Job = require("../models/Job");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route GET /api/jobs
// Supports: ?search=&location=&category=&jobType=&page=&limit=
router.get("/", async (req, res) => {
  try {
    const { search, location, category, jobType, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (location) query.location = { $regex: location, $options: "i" };
    if (category) query.category = category;
    if (jobType) query.jobType = jobType;

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/jobs/featured  (for home page)
router.get("/featured", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 }).limit(6);
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/jobs/mine  (employer's own postings)
router.get("/mine", protect, requireRole("employer"), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "companyName companyWebsite companyDescription name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/jobs  (employer only)
router.post(
  "/",
  protect,
  requireRole("employer"),
  [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("location").trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const job = await Job.create({
        ...req.body,
        employer: req.user._id,
        company: req.body.company || req.user.companyName || req.user.name,
      });
      res.status(201).json({ job });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// @route PUT /api/jobs/:id  (employer, own job only)
router.put("/:id", protect, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your job posting" });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/jobs/:id  (employer, own job only)
router.delete("/:id", protect, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your job posting" });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
