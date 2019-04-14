import boom from "boom";

import { wrapResult } from "server/utils/api";

import { safeObjectId } from "server/utils/database";

import { findOneById as findCompositionById } from "server/models/compositions";

import { create, updateOneById, deleteOneById } from "server/models/movements";
import _pickBy from "lodash/pickBy";

export function createMovementOrThrow({ parent, key, title }) {
  return findCompositionById(parent)
    .then(item => {
      if (!item) {
        return Promise.reject(boom.notFound("Composition not found"));
      }

      return {
        parent: safeObjectId(parent),
        key,
        title
      };
    })
    .then(create)
    .then(wrapResult);
}

export function updateMovement(id, { key, title }) {
  return updateOneById(id, _pickBy({ title, key })).then(({ updated, ok }) => {
    if (!ok) {
      return Promise.reject(boom.serverUnavailable());
    }

    return wrapResult({ updated, ok });
  });
}

export function deleteMovement(id) {
  return deleteOneById(id).then(({ deleted, ok }) => {
    if (!ok) {
      return Promise.reject(boom.serverUnavailable());
    }

    return wrapResult({ deleted, ok });
  });
}
