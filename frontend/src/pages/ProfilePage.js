import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/chatService";
import Layout from "../components/Layout";
import { User, Mail, Save, Shield } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ username: user?.username || "", email: user?.email || "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile({ username: form.username, email: form.email });
      updateUser(res.data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("Passwords don't match");
    if (passwords.new.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await userService.updateProfile({ current_password: passwords.current, new_password: passwords.new });
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password changed!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="h-screen overflow-y-auto p-6 space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account settings</p>
        </div>

        {/* Avatar */}
        <div className="glass rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user?.username}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <p className="text-xs text-purple-400 mt-1">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2"><User size={16} className="text-purple-400" /> Account Info</h3>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Username</label>
            <input
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-dark-700 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={15} /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Password Form */}
        <form onSubmit={handlePasswordChange} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2"><Shield size={16} className="text-cyan-400" /> Change Password</h3>
          {[
            { key: "current", label: "Current Password" },
            { key: "new", label: "New Password" },
            { key: "confirm", label: "Confirm New Password" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm text-slate-400 mb-1.5 block">{label}</label>
              <input
                type="password"
                value={passwords[key]}
                onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Shield size={15} /> {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilePage;
