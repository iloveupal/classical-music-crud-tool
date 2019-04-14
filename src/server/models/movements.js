import { asyncmap } from "asyncbox";

import { get } from "server/ioc";

import { constructAndQuery } from "server/utils/database";

import { buildParentQuery } from "./query-builders/movementQueryBuilders";

import { find as findRecordings } from "./recordings";

const db = get("db");

export const Movements = db.collection("movements");

Movements.createIndexes([
  {
    key: {
      title: "text"
    },
    name: "text-index"
  }
]);

export function find(query) {
  return Movements.find(query).toArray();
}

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
