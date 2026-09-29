import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-bold mb-2">Job Board</h3>
          <p>Connecting job seekers with the right opportunities, and employers with the right talent.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">For Candidates</h4>
          <ul className="space-y-1">
            <li>Browse Jobs</li>
            <li>Create Profile</li>
            <li>Track Applications</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">For Employers</h4>
          <ul className="space-y-1">
            <li>Post a Job</li>
            <li>Manage Applicants</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-800">
        © {new Date().getFullYear()} Job Board. All rights reserved.
      </div>
    </footer>
  );
}
