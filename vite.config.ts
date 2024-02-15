import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ConfigEnv, PluginOption, defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import { buildPreviewMode } from "./preview-mode-vite-plugin";

export default ({ mode }: ConfigEnv) => {
  // https://vitejs.dev/config/

  const plugins: PluginOption[] = [
    Inspect({
      build: true,
      outputDir: ".vite-inspect",
    }),
    react(),
    buildPreviewMode({ mode, previewExtension: "preview" }),
  ];

  return defineConfig({
    build: {
      outDir: "dist",
    },
    plugins,
    resolve: {
      alias: [
        {
          find: "@views",
          replacement: path.resolve(__dirname, "./src/views"),
        },
      ],
    },
  });
};
