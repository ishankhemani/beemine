import { apiFetch } from "./apiClient";

export const getDashboardStats = () => {
  const token = localStorage.getItem("adminToken"); // unchanged

  return apiFetch("/beemine/admin/admin_dashboard_stats.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
};
