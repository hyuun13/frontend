import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/naver": {
        target: "https://openapi.naver.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/naver/, "/v1"), // /naver를 /v1로 변경
        secure: false,
      },
      "/v1": {
        target: "http://43.200.7.229:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, ""),
      },
    },
  },
});
