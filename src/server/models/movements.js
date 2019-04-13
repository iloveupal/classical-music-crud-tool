import { asyncmap } from "asyncbox";

import { get } from "server/ioc";
import {
  safeObjectId,
  constructEqQuery,
  constructAndQuery
} from "server/utils/database";

import { find as findRecordings } from "./recordings";
import { Compositions } from "./compositions";

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
    constructAndQuery([
      constructEqQuery("parent", movement._id),
      ...queryForRecordings
    ])
  ).then(recordings => ({
    ...movement,
    recordings
  }));
}
