export function isAudioFile({ type }) {
  return type.includes("audio/");
}

export function getFilePath({ path }) {
  return path;
}

export function getFileType({ type }) {
  return type;
}
