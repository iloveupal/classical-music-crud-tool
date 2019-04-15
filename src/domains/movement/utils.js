export function renderKey(keyId) {
  if (!keyId) {
    return "No key provided";
  }

  return keyId
    .split("_")
    .map((keyPart, index) => {
      if (index === 0) {
        return keyPart.toUpperCase();
      }

      if (keyPart === "s") {
        return "#";
      }

      if (keyPart === "m") {
        return " minor";
      }
    })
    .join("");
}
