import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary-700">
          <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">JB</span>
          Job Board
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <Link to="/jobs" className="hover:text-primary-600">Browse Jobs</Link>
          {user?.role === "employer" && (
            <Link to="/employer/dashboard" className="hover:text-primary-600">Dashboard</Link>
          )}
          {user?.role === "candidate" && (
            <Link to="/candidate/dashboard" className="hover:text-primary-600">My Applications</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600">Log in</Link>
              <Link to="/register" className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Sign up
              </Link>
            </>
          ) : (
            <>
              {user.role === "employer" && (
                <Link to="/employer/post-job" className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Post a Job
                </Link>
              )}
              <span className="text-sm text-gray-600 hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-700 hover:text-red-600">
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
