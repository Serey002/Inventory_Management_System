import { useState, FormEvent } from "react";
import { RegisterPayload } from "../types/authTypes";

interface Props {
  onSubmit: (data: RegisterPayload) => Promise<void>;
  loading: boolean;
}

export function RegisterForm({ onSubmit, loading }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (password !== confirm) {
      setValidationError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    await onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <p className="form-subtitle">Create your account to get started.</p>

      {validationError && (
        <div className="error-banner inline">
          <span className="error-icon">!</span>
          {validationError}
        </div>
      )}

      <div className="field">
        <label htmlFor="reg-name">Full Name</label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
          autoComplete="name"
        />
      </div>

      <div className="field">
        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>

        <div className="field">
          <label htmlFor="reg-confirm">Confirm</label>
          <input
            id="reg-confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? <span className="spinner" /> : "Create Account →"}
      </button>
    </form>
  );
}