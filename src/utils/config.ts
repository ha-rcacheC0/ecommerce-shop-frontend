// src/config.ts

// Use environment variable or fallback to production API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://crew-fireworks-api.fly.dev/api",
};
