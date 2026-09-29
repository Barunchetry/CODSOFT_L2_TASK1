import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusColors = {
  Applied: "bg-gray-100 text-gray-600",
  "Under Review": "bg-blue-50 text-blue-600",
  Shortlisted: "bg-amber-50 text-amber-600",
  Rejected: "bg-red-50 text-red-600",
  Hired: "bg-green-50 text-green-600",
};

export default function CandidateDashboard() {
  const { user, setUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    headline: user?.headline || "",
    skills: (user?.skills || []).join(", "),
    location: user?.location || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeMsg, setResumeMsg] = useState("");

  useEffect(() => {
    api.get("/applications/mine").then((res) => setApplications(res.data.applications)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put("/users/profile", {
        headline: profile.headline,
        location: profile.location,
        skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } finally {
      setSavingProfile(false);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append("resume", resumeFile);
    const res = await api.post("/users/resume", formData, { headers: { "Content-Type": "multipart/form-data" } });
    setResumeMsg("Resume updated!");
    const updatedUser = { ...user, resumeUrl: res.data.resumeUrl };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Profile</h2>
            <form onSubmit={saveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Headline</label>
                <input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="e.g. PHP Developer" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Location</label>
                <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Skills (comma separated)</label>
                <input value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  placeholder="PHP, MySQL, React" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
              </div>
              <button type="submit" disabled={savingProfile}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-60">
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Default Resume</h2>
            {user?.resumeUrl && (
              <a href={`http://localhost:5000${user.resumeUrl}`} target="_blank" rel="noreferrer"
                className="text-xs text-primary-600 hover:underline block mb-3">View current resume</a>
            )}
            <form onSubmit={uploadResume} className="space-y-3">
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700" />
              <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold py-2 rounded-lg">
                Upload Resume
              </button>
              {resumeMsg && <p className="text-xs text-green-600">{resumeMsg}</p>}
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-3">My Applications ({applications.length})</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : applications.length === 0 ? (
            <div className="text-gray-400 text-sm">
              You haven't applied to any jobs yet. <Link to="/jobs" className="text-primary-600 hover:underline">Browse jobs →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app._id} className="bg-white border rounded-xl p-4 flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/jobs/${app.job?._id}`} className="font-medium hover:text-primary-600">{app.job?.title}</Link>
                    <p className="text-xs text-gray-500">{app.job?.company} · {app.job?.location}</p>
                    <p className="text-xs text-gray-400 mt-1">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
