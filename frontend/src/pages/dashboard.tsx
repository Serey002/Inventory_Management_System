import { User } from "../types/authTypes";

interface Props {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: Props) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="dashboard">
      <div className="dash-card">
        <div className="dash-header">
          <div className="dash-brand">
            <span className="brand-dot" />
            <span className="brand-name">NEXUS</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Sign out
          </button>
        </div>

        <div className="dash-body">
          <div className="avatar">{initials}</div>

          <h1 className="dash-welcome">
            Welcome back,<br />
            <span>{user.name}</span>
          </h1>

          <div className="user-meta">
            <div className="meta-row">
              <span className="meta-label">Email</span>
              <span className="meta-value">{user.email}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Role</span>
              <span className="meta-value meta-badge">{user.role ?? "No role assigned"}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Status</span>
              <span className={`meta-value meta-status ${user.isActive ? "active" : "inactive"}`}>
                {user.isActive ? "● Active" : "○ Inactive"}
              </span>
            </div>
          </div>

          <div className="jwt-notice">
            <span className="jwt-icon">🔐</span>
            Authenticated via JWT
          </div>
        </div>
      </div>

      <div className="bg-grid" aria-hidden />
    </div>
  );
}