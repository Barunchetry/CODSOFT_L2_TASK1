import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data.job)).catch(() => {});
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Please attach your resume (PDF, DOC, or DOCX).");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("coverLetter", coverLetter);

    setLoading(true);
    try {
      await api.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit application");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Application submitted 🎉</h1>
        <p className="text-gray-500 mb-6">
          We've emailed you a confirmation. The employer will review your application soon.
        </p>
        <Link to="/candidate/dashboard" className="text-primary-600 font-medium hover:underline">
          View my applications →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link to={`/jobs/${id}`} className="text-sm text-primary-600 hover:underline">← Back to job</Link>
      <h1 className="text-2xl font-bold mt-3">Apply {job ? `for ${job.title}` : ""}</h1>
      <p className="text-gray-500 text-sm mb-6">{job?.company}</p>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-xl p-6">
        <div>
          <label className="text-sm font-medium">Resume (PDF, DOC, DOCX — max 5MB)</label>
          <input
            type="file"
            required
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Cover Letter (optional)</label>
          <textarea
            rows={6}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell the employer why you're a great fit..."
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
