import { ConfigEnv, PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Inspect from "vite-plugin-inspect";
import fs from "fs";
import path from "path";

interface PreviewModeOptions {
  previewExtension?: string;
}

const buildPreviewMode =
  ({ previewExtension = "preview" }: PreviewModeOptions) =>
  (): PluginOption => ({
    name: "my-plugin",
    async load(id) {
      const isNodeModule = id.includes("node_modules");

      if (!isNodeModule) {
        const fileName = id.substring(id.lastIndexOf("/") + 1, id.length);
        const extension =
          fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
          fileName;

        const previewFile = id.replace(
          extension,
          `${previewExtension}.${extension}`
        );
        const previewExists = fs.existsSync(previewFile);

        if (previewExists) {
          console.log({
            id,
            isNodeModule,
            fileName,
            extension,
            previewFile,
            previewExists,
          });
          return fs.readFileSync(previewFile, "utf-8");
        }
      }
      return null;
    },
  });

export default ({ mode }: ConfigEnv) => {
  // https://vitejs.dev/config/

  const plugins: PluginOption[] = [
    Inspect({
      build: true,
      outputDir: ".vite-inspect",
    }),
    react(),
  ];

  if (mode.includes("preview")) {
    plugins.push(buildPreviewMode({ previewExtension: "preview" })());
  }

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
