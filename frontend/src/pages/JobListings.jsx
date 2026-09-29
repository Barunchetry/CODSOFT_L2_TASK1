import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function JobListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") || 1);
  const jobType = searchParams.get("jobType") || "";

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    api
      .get("/jobs", { params })
      .then((res) => {
        setJobs(res.data.jobs);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Browse Jobs</h1>
      <SearchBar initial={Object.fromEntries(searchParams.entries())} />

      <div className="flex flex-wrap gap-2 mt-5">
        <button
          onClick={() => setFilter("jobType", "")}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border ${!jobType ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600"}`}
        >
          All Types
        </button>
        {JOB_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter("jobType", t)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border ${jobType === t ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-5 mb-3">{loading ? "Searching..." : `${total} job${total !== 1 ? "s" : ""} found`}</p>

      {!loading && jobs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No jobs match your search. Try different keywords or clear filters.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${p === page ? "bg-primary-600 text-white" : "bg-white border text-gray-600"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
