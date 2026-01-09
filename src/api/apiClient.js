const BASE_URL = "https://sggsapp.co.in";

export async function apiFetch(endpoint, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  // Set JSON header ONLY when body is plain object
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  if (!text) {
    throw new Error("Empty response from server");
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", text);
    throw new Error("Invalid server response");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}