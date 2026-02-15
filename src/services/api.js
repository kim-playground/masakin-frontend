import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is 401 and NOT from the login endpoint
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
};

// ============================================
// RECIPES API
// ============================================
export const recipesAPI = {
  getAll: (params) => api.get("/recipes", { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (data) => api.post("/recipes", data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),
};

// ============================================
// REACTION API
// ============================================
export const reactionAPI = {
  react: (recipeId) => api.post(`/recipes/${recipeId}/react`),
  unreact: (recipeId) => api.delete(`/recipes/${recipeId}/react`),
};

// ============================================
// SAVE API
// ============================================
export const saveAPI = {
  saveRecipe: (recipeId) => api.post(`/recipes/${recipeId}/save`),
  unsaveRecipe: (recipeId) => api.delete(`/recipes/${recipeId}/save`),
};

// ============================================
// FOLLOW API
// ============================================
export const followAPI = {
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.delete(`/users/${userId}/follow`),
};

// ============================================
// PROFILE API
// ============================================
export const profileAPI = {
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  getUserRecipes: (userId) => api.get(`/users/${userId}/recipes`),
  getMyAnalytics: () => api.get("/users/me/analytics"),
};

export default api;
