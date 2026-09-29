import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyJob from "./pages/ApplyJob";
import PostJob from "./pages/PostJob";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/jobs/:id/apply" element={
            <ProtectedRoute role="candidate"><ApplyJob /></ProtectedRoute>
          } />
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
          } />

          <Route path="/employer/post-job" element={
            <ProtectedRoute role="employer"><PostJob /></ProtectedRoute>
          } />
          <Route path="/employer/dashboard" element={
            <ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<div className="text-center py-24 text-gray-400">Page not found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
