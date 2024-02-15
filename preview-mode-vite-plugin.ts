import fs from "fs";
import { PluginOption } from "vite";

interface PreviewModeOptions {
  previewExtension: string;
  mode: string;
}

/**
 * This plugin
 * @param PreviewModeOptions
 * @returns
 */
export const buildPreviewMode = ({
  previewExtension,
  mode,
}: PreviewModeOptions): PluginOption => ({
  name: "my-plugin",
  async load(id) {
    const isNodeModule = id.includes("node_modules");
    const isPreviewMode = mode.includes("preview");

    if (!isNodeModule && isPreviewMode) {
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
