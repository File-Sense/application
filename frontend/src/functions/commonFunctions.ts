export const uint8arrayToBlob = (
  binaryContent: Uint8Array,
  extension: string
) => {
  const imageBlob = new Blob([binaryContent], { type: `image/${extension}` });
  return imageBlob;
};
