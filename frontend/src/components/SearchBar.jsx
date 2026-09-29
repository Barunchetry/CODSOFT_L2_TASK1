import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ initial = {} }) {
  const [search, setSearch] = useState(initial.search || "");
  const [location, setLocation] = useState(initial.location || "");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl shadow-lg">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Job title, keywords, or company"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="sm:w-56 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg">
        Find Job
      </button>
    </form>
  );
}
