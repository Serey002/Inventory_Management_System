import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./pages/loginForm";
import { RegisterForm } from "./pages/registerForm";
import { Dashboard } from "./pages/dashboard";
import "./index.css";

type View = "login" | "register";

function App() {
  const [view, setView] = useState<View>("login");
  const { user, loading, error, isAuthenticated, login, register, logout, setError } = useAuth();

  const handleSwitch = (v: View) => {
    setError(null);
    setView(v);
  };

  if (isAuthenticated && user) {
    return <Dashboard user={user} onLogout={logout} />;
  }

  return (
    <div className="app-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-dot" />
          <span className="brand-name">NEXUS</span>
        </div>

        <div className="tab-bar">
          <button
            className={`tab ${view === "login" ? "active" : ""}`}
            onClick={() => handleSwitch("login")}
          >
            Sign In
          </button>
          <button
            className={`tab ${view === "register" ? "active" : ""}`}
            onClick={() => handleSwitch("register")}
          >
            Register
          </button>
          <div className={`tab-indicator ${view === "register" ? "right" : "left"}`} />
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <div className="form-area">
          {view === "login" ? (
            <LoginForm onSubmit={login} loading={loading} />
          ) : (
            <RegisterForm onSubmit={register} loading={loading} />
          )}
        </div>
      </div>

      <div className="bg-grid" aria-hidden />
    </div>
  );
}

export default App;