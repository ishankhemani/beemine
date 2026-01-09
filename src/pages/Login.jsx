import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, checkLogin } from "../api/auth.api";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // AUTO LOGIN IF SESSION EXISTS
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    checkLogin(token)
      .then(() => navigate("/dashboard"))
      .catch(() => localStorage.clear());
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ FIX: pass arguments correctly
      const res = await loginAdmin(email, password);

      const { token, name, role, token_expiry } = res.data;

      // STORE SESSION DATA
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminName", name);
      localStorage.setItem("adminRole", role);
      localStorage.setItem("tokenExpiry", token_expiry);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🔒</div>

        <h2>Admin Login</h2>
        <p>Enter your credentials to access the admin panel</p>

        <form onSubmit={handleSubmit}>
          <label>Admin ID / Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}