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
  enforce: "pre",
  async resolveId(source, importer, options) {
    if (!importer) return null;

    const isNodeModule = importer.includes("node_modules");
    const isPreviewMode = mode.includes("preview");

    if (isNodeModule || !isPreviewMode || source.startsWith("react"))
      return null;
    //console.log({ source, importer, options });

    const fileName = source.substring(
      source.lastIndexOf("/") + 1,
      source.length
    );

    const extension =
      fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
      fileName;

    const updatedId =
      fileName === extension
        ? `${source}.${previewExtension}`
        : source.replace(extension, `${previewExtension}.${extension}`);

    const updated = await this.resolve(
      updatedId,
      importer,
      Object.assign({ skipSelf: true }, options)
    );

    if (!updated) return null;
    const isUpdatedNodeModule = updated.id.includes("node_modules");

    if (isUpdatedNodeModule) return null;

    console.log({ source, updatedId, updated, options });
    return updated.id;
  },
});
