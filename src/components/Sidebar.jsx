import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Users", path: "/users" },
    { name: "Revenue", path: "/revenue" },
    { name: "Photo Verification", path: "/photo-verification" },
    { name: "Profile Verification", path: "/profile-verification" },
    { name: "Reports", path: "/reports" },
    { name: "Review Verification", path: "/reviews" },
  ];

  const handleLogout = () => {
    localStorage.clear();          // 🔥 clear token & admin data
    navigate("/", { replace: true }); // 🔁 go to login
  };

  return (
    <div className="sidebar">
      <h2 className="logo">AdminPanel</h2>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* 🔥 LOGOUT */}
      <div className="logout" onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
}

export default Sidebar;