import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import restart from "vite-plugin-restart";

export default defineConfig({
  plugins: [
    react(),
    restart({
      restart: ["src/**/*.{frag,vert,glsl}"],
    }),
    glsl({
      watch: true,
      include: [
        "**/*.glsl",
        "**/*.wgsl",
        "**/*.vert",
        "**/*.frag",
        "**/*.vs",
        "**/*.fs",
      ],
    }),
    tailwindcss(),
  ],
  server: {
    host: true,
  },
});
