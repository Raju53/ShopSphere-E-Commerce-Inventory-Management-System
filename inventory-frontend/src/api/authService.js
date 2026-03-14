const API_URL = "http://localhost:8080/api/auth";

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem("user", JSON.stringify(data)); // Store token and role
  }
  return data;
};

export const signup = async (userData) => {
  return fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};