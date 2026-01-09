import { apiFetch } from "./apiClient";

// Fetch profile verifications with pagination
export const getProfileVerifications = (page = 1, limit = 10) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/get_profile_verification.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      page,
      limit,
    }),
  });
};

// Update a specific profile verification
export const updateProfileVerification = ({ verification_id, action, remarks }) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/update_profile_verification.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Required for PHP
    },
    body: JSON.stringify({
      token,
      verification_id,
      action,
      remarks,
    }),
  });
};
