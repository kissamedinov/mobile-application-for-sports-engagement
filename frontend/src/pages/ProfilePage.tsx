import { FormEvent, useEffect, useState } from "react";
import { updateProfile } from "../api/users";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    sport_interest: "",
    skill_level: "",
    location: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      full_name: user.full_name || "",
      sport_interest: user.sport_interest || "",
      skill_level: user.skill_level || "",
      location: user.location || "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      setMessage("Profile updated successfully.");
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage("Failed to update profile.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="card max-w-md">
      <h1 className="page-title">Profile</h1>

      {message && (
        <div className="text-xs text-emerald-400 mb-3">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="label">{key.replace("_", " ")}</label>
            <input
              name={key}
              value={value}
              onChange={handleChange}
              className="input"
            />
          </div>
        ))}

        <button type="submit" className="button-primary">
          Save
        </button>
      </form>
    </div>
  );
}
