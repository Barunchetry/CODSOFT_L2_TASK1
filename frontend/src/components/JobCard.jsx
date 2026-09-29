import React from "react";
import { Link } from "react-router-dom";

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
};

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white border rounded-xl p-5 hover:shadow-md hover:border-primary-300 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
        </div>
        <span className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-1 rounded-full whitespace-nowrap">
          {job.jobType}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>{job.category}</span>
        <span>{timeAgo(job.createdAt)}</span>
      </div>
    </Link>
  );
}
