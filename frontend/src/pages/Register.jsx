import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate", companyName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-gray-500 text-sm mb-6">Join as a job seeker or an employer</p>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setForm({ ...form, role: "candidate" })}
            className={`py-2.5 rounded-lg text-sm font-medium border ${form.role === "candidate" ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600"}`}>
            Job Seeker
          </button>
          <button type="button" onClick={() => setForm({ ...form, role: "employer" })}
            className={`py-2.5 rounded-lg text-sm font-medium border ${form.role === "employer" ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600"}`}>
            Employer
          </button>
        </div>

        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input required value={form.name} onChange={update("name")}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        {form.role === "employer" && (
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <input value={form.companyName} onChange={update("companyName")}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" required value={form.email} onChange={update("email")}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={update("password")}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Log in</Link>
      </p>
    </div>
  );
}
