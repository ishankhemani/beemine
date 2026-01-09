// src/api/profile.api.js
import { apiFetch } from "./apiClient";

export const getProfile = (profile_id) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/get_profile.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      profile_id,
    }),
  });
};