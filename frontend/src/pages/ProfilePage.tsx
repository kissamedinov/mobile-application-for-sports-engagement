import { FormEvent, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { updateProfile } from "../api/users";

const ProfilePage = () => {
  const [form, setForm] = useState({
    full_name: "",
    sport_interest: "",
    skill_level: "",
    location: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCurrentUser().then((u) => {
      setForm({
        full_name: u.full_name || "",
        sport_interest: u.sport_interest || "",
        skill_level: u.skill_level || "",
        location: u.location || "",
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateProfile(form);
    setMessage("Profile updated");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      {message && <div className="text-xs text-emerald-400 mb-2">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs block mb-1">Full name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs block mb-1">Sport interest</label>
          <input
            name="sport_interest"
            value={form.sport_interest}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs block mb-1">Skill level</label>
          <input
            name="skill_level"
            value={form.skill_level}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs block mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-sm"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;