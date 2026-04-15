import {defineConfig} from "vite";
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
                debbo: "details/debbo.html",
                librana: "details/librana.html",
                "made-in-nigeria": "details/made-in-nigeria.html",
                semechcorp: "details/semechcorp.html",
                tracewaste: "details/trace-waste.html",
                "w3eco-friendly": "details/w3eco-friendly.html",
            },
        },
    },
    plugins: [tailwindcss()],
});
