import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const initial = {
  title: "", company: "", location: "", jobType: "Full-time", category: "General",
  description: "", responsibilities: "", requirements: "",
  salaryMin: "", salaryMax: "", currency: "INR", applicationDeadline: "",
};

export default function PostJob() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      const res = await api.post("/jobs", payload);
      navigate(`/jobs/${res.data.job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post job");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Job Title</label>
            <input required value={form.title} onChange={update("title")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <input value={form.company} onChange={update("company")} placeholder="Defaults to your profile" className={inputClass} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <input required value={form.location} onChange={update("location")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Job Type</label>
            <select value={form.jobType} onChange={update("jobType")} className={inputClass}>
              {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <input value={form.category} onChange={update("category")} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea required rows={4} value={form.description} onChange={update("description")} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium">Responsibilities</label>
          <textarea rows={3} value={form.responsibilities} onChange={update("responsibilities")} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium">Requirements</label>
          <textarea rows={3} value={form.requirements} onChange={update("requirements")} className={inputClass} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Min Salary</label>
            <input type="number" value={form.salaryMin} onChange={update("salaryMin")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Max Salary</label>
            <input type="number" value={form.salaryMax} onChange={update("salaryMax")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Deadline</label>
            <input type="date" value={form.applicationDeadline} onChange={update("applicationDeadline")} className={inputClass} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
