import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const loadJobs = () => {
    setLoading(true);
    api.get("/jobs/mine").then((res) => setJobs(res.data.jobs)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  const viewApplicants = (job) => {
    setActiveJob(job);
    setApplicantsLoading(true);
    api.get(`/applications/job/${job._id}`)
      .then((res) => setApplicants(res.data.applications))
      .catch(() => {})
      .finally(() => setApplicantsLoading(false));
  };

  const updateStatus = async (appId, status) => {
    await api.patch(`/applications/${appId}/status`, { status });
    setApplicants((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Delete this job posting?")) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    if (activeJob?._id === jobId) setActiveJob(null);
  };

  const statusColors = {
    Applied: "bg-gray-100 text-gray-600",
    "Under Review": "bg-blue-50 text-blue-600",
    Shortlisted: "bg-amber-50 text-amber-600",
    Rejected: "bg-red-50 text-red-600",
    Hired: "bg-green-50 text-green-600",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <p className="text-gray-500 text-sm">{user?.companyName || user?.name}</p>
        </div>
        <Link to="/employer/post-job" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm">
          + Post a Job
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-3">Your Job Postings ({jobs.length})</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-400 text-sm">You haven't posted any jobs yet.</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job._id} className={`bg-white border rounded-xl p-4 cursor-pointer ${activeJob?._id === job._id ? "border-primary-500 ring-1 ring-primary-500" : ""}`}
                  onClick={() => viewApplicants(job)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-xs text-gray-500">{job.location} · {job.jobType}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteJob(job._id); }}
                      className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-3">
            {activeJob ? `Applicants for "${activeJob.title}"` : "Select a job to view applicants"}
          </h2>
          {activeJob && (
            applicantsLoading ? (
              <p className="text-gray-400 text-sm">Loading applicants...</p>
            ) : applicants.length === 0 ? (
              <p className="text-gray-400 text-sm">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {applicants.map((app) => (
                  <div key={app._id} className="bg-white border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{app.candidate?.name}</h3>
                        <p className="text-xs text-gray-500">{app.candidate?.email}</p>
                        {app.candidate?.headline && <p className="text-xs text-gray-500 mt-1">{app.candidate.headline}</p>}
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <a href={`http://localhost:5000${app.resumeUrl}`} target="_blank" rel="noreferrer"
                        className="text-xs text-primary-600 font-medium hover:underline">View Resume</a>
                      <select value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)}
                        className="text-xs border rounded-lg px-2 py-1 ml-auto">
                        {["Applied", "Under Review", "Shortlisted", "Rejected", "Hired"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
