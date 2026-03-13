import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // ✅ 배포(exe)에서 자산 경로 깨짐 방지
});
