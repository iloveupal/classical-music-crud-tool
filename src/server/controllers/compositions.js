import boom from "boom";

import { findOneById, hydrateComposition } from "server/models/compositions";

export function getCompositionOrThrow(id) {
  return findOneById(id).then(item => {
    if (!item) {
      return Promise.reject(boom.notFound());
    }

    return hydrateComposition(item);
  });
}

export function filterCompositions({ offset, limit, sort, search }) {}
