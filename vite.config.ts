import { ConfigEnv, PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Inspect from "vite-plugin-inspect";
import fs from "fs";
import path from "path";

const buildPreviewMode = (): PluginOption => ({
  name: "my-plugin",
  enforce: "pre",
  async resolveId(source, importer) {
    if (!importer) return null;

    const isNodeModule = importer.includes("node_modules");
    const isTSXFile = source.includes(".tsx");

    if (!isNodeModule && isTSXFile) {
      // This path build probably needs to be fixed. Assuming
      // imports are always relative but won't work if we have an alias
      //Maybe some util functions to detect this
      const previewFile = path.resolve(
        `${__dirname}/src`,
        source.replace(".tsx", ".preview.tsx")
      );
      const previewExists = fs.existsSync(previewFile);

      if (previewExists) {
        console.log({
          importer,
          source,
          isTSXFile,
          previewFile,
          previewExists,
        });

        return previewFile;
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
    plugins.push(buildPreviewMode());
  }

  return defineConfig({
    build: {
      outDir: "dist",
    },
    plugins,
  });
};
