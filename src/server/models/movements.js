import { asyncmap } from "asyncbox";

import { get } from "server/ioc";

import { constructAndQuery } from "server/utils/database";

import { buildParentQuery } from "./query-builders/movementQueryBuilders";
import {
  __find,
  __findOneById,
  __insertOne,
  __updateOneById,
  __deleteOneById
} from "./generics/crud";

import { find as findRecordings } from "./recordings";

const db = get("db");

export const Movements = db.collection("movements");

Movements.createIndexes([
  {
    key: {
      title: "text"
    },
    name: "text-index"
  },
  {
    key: {
      parent: 1
    },
    name: "parent-index"
  }
]);

export const findOneById = __findOneById(Movements);
export const find = __find(Movements);
export const create = __insertOne(Movements);
export const updateOneById = __updateOneById(Movements);
export const deleteOneById = __deleteOneById(Movements);

export function hydrateMovements(movements, queryForRecordings = []) {
  return asyncmap(movements, movement =>
    hydrateMovement(movement, queryForRecordings)
  );
}

export function hydrateMovement(movement, queryForRecordings = []) {
  return findRecordings(
    constructAndQuery([buildParentQuery(movement._id), ...queryForRecordings])
  ).then(recordings => ({
    ...movement,
    recordings
  }));
}
