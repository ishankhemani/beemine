import { apiFetch } from "./apiClient";

/**
 * Get reported profiles list
 */
export const getReports = (page = 1, limit = 10) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/get_report_profiles.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      page,
      limit,
    }),
  });
};

/**
 * Update report action
 * action: ban | warn | dismiss | resolve
 */
export const updateReport = ({ report_id, action, remarks }) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/update_report.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      report_id,
      action,
      remarks,
    }),
  });
};
