import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = login(username, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-light tracking-widest2 text-gold-light">AURELIA</span>
          </Link>
          <p className="text-[10px] tracking-widest uppercase text-champagne/40 font-body mt-2">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-gold/20 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 text-red-300 text-sm font-body">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[10px] tracking-widest uppercase text-champagne/60 font-body mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-gold/20 text-ivory placeholder-champagne/30 text-sm font-body px-4 py-3 outline-none focus:border-gold/50"
              placeholder="admin"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-widest uppercase text-champagne/60 font-body mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-gold/20 text-ivory placeholder-champagne/30 text-sm font-body px-4 py-3 outline-none focus:border-gold/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-obsidian text-xs tracking-widest uppercase py-4 font-body font-medium hover:bg-gold-light transition-colors"
          >
            Sign In
          </button>

          <p className="text-[10px] text-champagne/30 font-body text-center mt-6">
            Demo: admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
