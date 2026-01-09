// src/api/auth.api.js

import { apiFetch } from "./apiClient";

/**
 * LOGIN API
 * First time login with email + password
 */
export const loginAdmin = (email, password) => {
  return apiFetch("/beemine/admin/login.php", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

/**
 * CHECK LOGIN API
 * Used for persistent login (refresh / revisit)
 */
export const checkLogin = (token) => {
  return apiFetch("/beemine/admin/check_login.php", {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
  });
};