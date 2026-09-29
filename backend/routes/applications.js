const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const upload = require("../middleware/upload");
const sendEmail = require("../utils/sendEmail");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route POST /api/applications/:jobId  (candidate only) - apply with resume upload
router.post(
  "/:jobId",
  protect,
  requireRole("candidate"),
  upload.single("resume"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const resumeUrl = req.file
        ? `/uploads/resumes/${req.file.filename}`
        : req.user.resumeUrl;

      if (!resumeUrl) {
        return res.status(400).json({ message: "A resume is required (upload one or save it to your profile)" });
      }

      const application = await Application.create({
        job: job._id,
        candidate: req.user._id,
        employer: job.employer,
        coverLetter: req.body.coverLetter || "",
        resumeUrl,
      });

      // Fire-and-forget email notifications (never block the response on SMTP issues)
      sendEmail({
        to: req.user.email,
        subject: `Application submitted: ${job.title}`,
        html: `<p>Hi ${req.user.name},</p><p>Your application for <strong>${job.title}</strong> at ${job.company} was submitted successfully.</p>`,
      }).catch((e) => console.error("Email error:", e.message));

      const employer = await User.findById(job.employer);
      if (employer) {
        sendEmail({
          to: employer.email,
          subject: `New application: ${job.title}`,
          html: `<p>${req.user.name} just applied for <strong>${job.title}</strong>.</p>`,
        }).catch((e) => console.error("Email error:", e.message));
      }

      res.status(201).json({ application });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "You have already applied to this job" });
      }
      res.status(500).json({ message: err.message });
    }
  }
);

// @route GET /api/applications/mine  (candidate's own applications)
router.get("/mine", protect, requireRole("candidate"), async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job", "title company location jobType")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/applications/job/:jobId  (employer viewing applicants for their job)
router.get("/job/:jobId", protect, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your job posting" });
    }
    const applications = await Application.find({ job: job._id })
      .populate("candidate", "name email headline skills location resumeUrl")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PATCH /api/applications/:id/status  (employer updates application status)
router.patch("/:id/status", protect, requireRole("employer"), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Applied", "Under Review", "Shortlisted", "Rejected", "Hired"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const application = await Application.findById(req.params.id).populate("candidate", "name email").populate("job", "title company");
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    sendEmail({
      to: application.candidate.email,
      subject: `Update on your application: ${application.job.title}`,
      html: `<p>Hi ${application.candidate.name},</p><p>Your application status for <strong>${application.job.title}</strong> at ${application.job.company} is now: <strong>${status}</strong>.</p>`,
    }).catch((e) => console.error("Email error:", e.message));

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
