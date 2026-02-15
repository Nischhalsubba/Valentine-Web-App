import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "build",
        chunkSizeWarningLimit: 700,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.indexOf("node_modules/react") !== -1 || id.indexOf("node_modules/scheduler") !== -1) {
                        return "react-vendor";
                    }
                    if (id.indexOf("node_modules/@react-spring") !== -1 ||
                        id.indexOf("node_modules/motion") !== -1 ||
                        id.indexOf("node_modules/@mojs") !== -1 ||
                        id.indexOf("node_modules/animejs") !== -1 ||
                        id.indexOf("node_modules/velocity-animate") !== -1) {
                        return "animation-vendor";
                    }
                    if (id.indexOf("node_modules/react-transition-group") !== -1 || id.indexOf("node_modules/@formkit") !== -1) {
                        return "ui-motion-vendor";
                    }
                }
            }
        }
    }
});
