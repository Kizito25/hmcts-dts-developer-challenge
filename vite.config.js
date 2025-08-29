import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import Axios from "axios";
import react from "@vitejs/plugin-react";
import netlifyPlugin from "@netlify/vite-plugin-react-router";

// Axios Network Request Defaults
Axios.create({
  baseURL: "http://http://0.0.0.0/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    netlifyPlugin(), // ← add this
  ],
});
