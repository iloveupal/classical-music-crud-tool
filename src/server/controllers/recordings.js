import { ObjectId } from "mongodb";

import _get from "lodash/get";
import boom from "boom";

import { isAudioFile, getFilePath, getFileType } from "server/utils/file";
import { getMetadataFromPath } from "server/utils/audio";
import { wrapResult } from "server/utils/api";
import { safeObjectId } from "server/utils/database";

import { findOneById as findMovementById } from "server/models/movements";

import { create } from "server/models/recordings";

export function handleRecordingUpload(file) {
  if (!isAudioFile(file)) {
    return Promise.reject(boom.badRequest("Not an audio file"));
  }

  // we can save this file info in mongo, but just in scope of this assignment, will return a random objectId.

  const savedFileId = ObjectId();

  return getMetadataFromPath(getFilePath(file), getFileType(file))
    .then(fullMetadata => {
      return {
        artists: _get(fullMetadata, "common.artists", []),
        year: _get(fullMetadata, "common.year")
      };
    })
    .then(metadata => {
      return {
        _id: savedFileId,
        metadata
      };
    })
    .then(wrapResult);
}

export function createRecordingOrThrow({ parent, performers, year }) {
  return findMovementById(parent)
    .then(item => {
      if (!item) {
        return Promise.reject(boom.notFound("Movement not found"));
      }

      return {
        parent: safeObjectId(parent),
        performers,
        year
      };
    })
    .then(create)
    .then(wrapResult);
}
