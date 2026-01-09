import { apiFetch } from "./apiClient";

/**
 * Get app reviews for verification
 */
export const getAppReviewVerifications = (page = 1, limit = 10) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/get_app_review_verification.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      page,
      limit,
    }),
  });
};

/**
 * Update review status (approve / reject)
 */
export const updateAppReviewStatus = ({
  review_id,
  action, // "approve" | "reject"
  remarks = "",
}) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/update_app_review_status.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      review_id,
      action,
      remarks,
    }),
  });
};
