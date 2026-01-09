import { apiFetch } from "./apiClient";

export const getUsers = ({
  page = 1,
  limit = 10,
  search = "",
  gender = "",
  verified = "",
}) => {
  const token = localStorage.getItem("adminToken");

  return apiFetch("/beemine/admin/get_users.php", {
    method: "POST",
    body: JSON.stringify({
      token,
      page,
      limit,
      search,
      gender,     // "Man" | "Woman" | ""
      verified,   // 1 | 0 | ""
    }),
  });
};