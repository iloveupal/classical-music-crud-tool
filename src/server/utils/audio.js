import fs from "fs";

import * as mm from "music-metadata";

export function getMetadataFromPath(path, type) {
  return mm.parseStream(fs.createReadStream(path), type);
}
