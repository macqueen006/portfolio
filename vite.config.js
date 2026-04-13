import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/portfolio/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        about: "about.html",
        contact: "contact.html",
        blog: "blog.html",
        projects: "projects.html",
      },
    },
  },
  plugins: [tailwindcss()],
});
