export const uint8arrayToBlob = (
  binaryContent: Uint8Array,
  extension: string
) => {
  const imageBlob = new Blob([binaryContent], { type: `image/${extension}` });
  return imageBlob;
};

export const pathReplace = (path: string): string => {
  const escapedPath = path.replace(/\\/g, "\\\\");
  return escapedPath;
};

export const pathToDisplayPath = (path: string): string => {
  const normalizedPath = path.replace(/\\/g, "/");
  const pathParts = normalizedPath.split("/");
  if (pathParts.length > 2) {
    pathParts.splice(1, pathParts.length - 2, "..");
  }
  const resultPath = pathParts.join("/");
  return resultPath;
};

export const extractFileNameAndExtension = (
  path: string
): {
  fileName: string;
  extension: string;
} => {
  const match = path.match(/\\([^\\]+(\.[^\\]+)?)$/);

  if (match) {
    const fileNameWithExtension = match[1];
    const lastDotIndex = fileNameWithExtension.lastIndexOf(".");

    if (lastDotIndex !== -1) {
      const fileName = fileNameWithExtension.substring(0, lastDotIndex);
      const extension = fileNameWithExtension.substring(lastDotIndex + 1);
      return { fileName, extension };
    }
  }

  return { fileName: "", extension: "" };
};
