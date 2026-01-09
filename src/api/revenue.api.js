// src/api/revenue.api.js
import { apiFetch } from "./apiClient";

export const getRevenueAnalytics = ({ fromDate, toDate }) => {
  const token = localStorage.getItem("adminToken"); // SAME key

  return apiFetch("/beemine/admin/get_revenue_analytics.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      from_date: fromDate,
      to_date: toDate,
    }),
  });
};