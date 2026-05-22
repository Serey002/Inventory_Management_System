import { useState, FormEvent } from "react";
import { LoginPayload } from "../types/authTypes";

interface Props {
  onSubmit: (data: LoginPayload) => Promise<void>;
  loading: boolean;
}

export function LoginForm({ onSubmit, loading }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <p className="form-subtitle">Welcome back. Sign in to continue.</p>

      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="field">
        <label htmlFor="login-password">Password</label>
        <div className="input-wrapper">
          <input
            id="login-password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="toggle-pass"
            onClick={() => setShowPass(!showPass)}
            aria-label="Toggle password"
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? <span className="spinner" /> : "Sign In →"}
      </button>
    </form>
  );
}