// Connect to backend API if available, fallback to local dev backend
export const url = (import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1") + "/user"