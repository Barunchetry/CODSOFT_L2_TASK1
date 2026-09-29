import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs/featured")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 to-primary-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <p className="uppercase tracking-wide text-primary-100 font-semibold mb-2">
            {jobs.length > 0 ? `${jobs.length}+ jobs listed` : "Jobs listed daily"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl">Find Your Dream Job</h1>
          <p className="mt-4 text-primary-50 max-w-xl">
            Browse thousands of openings from companies actively hiring, or post a role and
            find your next great hire in minutes.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>
          <div className="mt-6 flex gap-4 text-sm">
            <Link to="/register" className="underline text-primary-50 hover:text-white">
              Upload your resume →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Jobs</h2>
          <Link to="/jobs" className="text-primary-600 font-medium text-sm hover:underline">
            View all jobs →
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-400">No jobs posted yet. Be the first employer to post one!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-14 grid sm:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl border">
            <h3 className="font-bold text-lg mb-2">I'm a Job Seeker</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create a profile, upload your resume, and apply to jobs in one click.
            </p>
            <Link to="/register" className="text-primary-600 font-semibold text-sm hover:underline">
              Get started →
            </Link>
          </div>
          <div className="p-6 rounded-xl border">
            <h3 className="font-bold text-lg mb-2">I'm an Employer</h3>
            <p className="text-gray-600 text-sm mb-4">
              Post openings and manage applicants from a single dashboard.
            </p>
            <Link to="/register" className="text-primary-600 font-semibold text-sm hover:underline">
              Post a job →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
