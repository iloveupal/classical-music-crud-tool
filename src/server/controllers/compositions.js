import _pickBy from "lodash/pickBy";

import boom from "boom";

import { wrapResult, wrapArrayResult } from "server/utils/api";

import {
  findOneById,
  hydrateComposition,
  hydrateCompositions,
  find,
  create,
  updateOneById,
  deleteOneById
} from "server/models/compositions";

import { buildTextQuery as buildCompositionTextQuery } from "server/models/query-builders/compositionQueryBuilders";

import {
  buildKeyQuery,
  buildTextQuery as buildMovementTextQuery
} from "server/models/query-builders/movementQueryBuilders";

import {
  buildPerformerQuery,
  buildTypeQuery,
  buildYearQuery
} from "server/models/query-builders/recordingQueryBuilders";

export function getCompositionOrThrow(id) {
  return findOneById(id)
    .then(item => {
      if (!item) {
        return Promise.reject(boom.notFound());
      }

      return hydrateComposition(item);
    })
    .then(wrapResult);
}

export function listCompositions({ offset, limit }) {
  return find()
    .then(compositions => hydrateCompositions(compositions))
    .then(wrapArrayResult({ offset, limit }));
}

export function filterCompositions({ offset, limit, search = {} }) {
  const { text, movement, key, performer, type, year } = search;

  return find(buildCompositionTextQuery(text))
    .then(compositions =>
      hydrateCompositions(
        compositions,
        [buildKeyQuery(key), buildMovementTextQuery(movement)],
        [
          buildPerformerQuery(performer),
          buildTypeQuery(type),
          buildYearQuery(year)
        ]
      )
    )
    .then(compositions => {
      // if no search was performed on Composition entity itself, we are free to remove those
      // compositions that are not relevant to our search.
      if (!text) {
        return compositions.filter(composition => {
          // if no filters are concerned with Movement entity, check if movements
          if (!key && !movement) {
            composition.movements = composition.movements.filter(movement => {
              if (!movement.recordings.length) {
                return null;
              }

              return movement;
            });
          }

          // if no movements, => this is not the composition we're looking for.
          if (!composition.movements.length) {
            return null;
          }

          return composition;
        });
      }

      return compositions;
    })
    .then(wrapArrayResult({ offset, limit }));
}

export function createCompositionOrThrow({ title, composer }) {
  return create({ title, composer }).then(id => {
    if (!id) {
      return Promise.reject(boom.serverUnavailable());
    }

    return wrapResult(id);
  });
}

export function updateComposition(id, { title, composer }) {
  return updateOneById(id, _pickBy({ title, composer })).then(
    ({ updated, ok }) => {
      if (!ok) {
        return Promise.reject(boom.serverUnavailable());
      }

      return wrapResult({ updated, ok });
    }
  );
}

export function deleteComposition(id) {
  return deleteOneById(id).then(({ deleted, ok }) => {
    if (!ok) {
      return Promise.reject(boom.serverUnavailable());
    }

    return wrapResult({ deleted, ok });
  });
}
