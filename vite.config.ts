import react from "@vitejs/plugin-react-swc";
import { ConfigEnv, PluginOption, defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

const getAlias = (mode: string) => {
  console.log("getAlias", mode);
  if (mode.includes("preview")) {
    return [
      {
        find: /^(.*)\.real$/,
        replacement: "$1.preview",
      },
    ];
  }

  return [];
};

const getOutDir = (mode: string) => {
  console.log("getAlias", mode);
  if (mode.includes("preview")) {
    return "dist-preview";
  }

  return "dist";
};

export default ({ mode }: ConfigEnv) => {
  // https://vitejs.dev/config/

  const plugins: PluginOption[] = [
    Inspect({
      build: true,
      outputDir: ".vite-inspect",
    }),
    react(),
  ];

  return defineConfig({
    build: {
      outDir: getOutDir(mode),
    },
    plugins,
    resolve: {
      alias: getAlias(mode),
    },
  });
};
