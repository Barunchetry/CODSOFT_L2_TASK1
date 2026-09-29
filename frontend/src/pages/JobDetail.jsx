import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data.job))
      .catch(() => setError("Job not found or no longer available."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!job) return null;

  const salary =
    job.salaryMin && job.salaryMax
      ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
      : "Not disclosed";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/jobs" className="text-sm text-primary-600 hover:underline">← Back to jobs</Link>

      <div className="bg-white border rounded-xl p-8 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company} · {job.location}</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-1 rounded-full">{job.jobType}</span>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.category}</span>
            </div>
          </div>

          {user?.role !== "employer" && (
            <Link
              to={`/jobs/${job._id}/apply`}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg text-center whitespace-nowrap"
            >
              Apply Now
            </Link>
          )}
        </div>

        <dl className="grid sm:grid-cols-3 gap-4 mt-8 text-sm">
          <div>
            <dt className="text-gray-400">Salary Range</dt>
            <dd className="font-medium">{salary}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Job Type</dt>
            <dd className="font-medium">{job.jobType}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Deadline</dt>
            <dd className="font-medium">
              {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "Open"}
            </dd>
          </div>
        </dl>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Job Description</h2>
            <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{job.description}</p>
          </div>
          {job.responsibilities && (
            <div>
              <h2 className="font-semibold mb-2">Responsibilities</h2>
              <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{job.responsibilities}</p>
            </div>
          )}
          {job.requirements && (
            <div>
              <h2 className="font-semibold mb-2">Requirements</h2>
              <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{job.requirements}</p>
            </div>
          )}
        </div>

        {job.employer && (
          <div className="mt-8 pt-6 border-t">
            <h2 className="font-semibold mb-1">About {job.company}</h2>
            <p className="text-gray-600 text-sm">{job.employer.companyDescription || "No company description provided."}</p>
            {job.employer.companyWebsite && (
              <a href={job.employer.companyWebsite} target="_blank" rel="noreferrer" className="text-primary-600 text-sm hover:underline">
                {job.employer.companyWebsite}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
