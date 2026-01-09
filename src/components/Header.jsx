import "../styles/header.css";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="admin-header">
      {/* LEFT */}
      <div className="header-left">
        <img src={logo} alt="BeeStack" className="header-logo" />
      
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <div className="header-search">
          <input
            type="text"
            placeholder="Search global..."
          />
        </div>

        <div className="header-actions">
          <button className="icon-btn">🔔</button>
          <div className="profile-badge">AD</div>
        </div>
      </div>
    </header>
  );
}