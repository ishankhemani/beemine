import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import "../styles/admin.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      {/* 🔥 THIS WRAPPER WAS MISSING */}
      <div className="admin-main">
        <Header />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;