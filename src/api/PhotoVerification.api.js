import { apiFetch } from "./apiClient";

export const getPhotoVerifications = (page = 1, limit = 10) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/get_photo_verification.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      page,
      limit,
    }),
  });
};

export const updatePhotoVerification = ({
  photo_id,
  action,
  reason,
}) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/update_photo_verification.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      photo_id,
      action, // approve | reject
      reason,
    }),
  });
};