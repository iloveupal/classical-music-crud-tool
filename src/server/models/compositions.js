import { asyncmap } from "asyncbox";

import { get } from "server/ioc";
import {
  safeObjectId,
  constructEqQuery,
  constructAndQuery,
  constructSetQuery
} from "server/utils/database";
import { find as findMovements, hydrateMovements } from "./movements";

const db = get("db");

export const Compositions = db.collection("compositions");

Compositions.createIndexes([
  {
    key: {
      composer: "text",
      title: "text"
    },
    name: "text-index"
  }
]);

export function findOneById(id) {
  return Compositions.findOne({ _id: safeObjectId(id) });
}

export function find(query) {
  return Compositions.find(query).toArray();
}

export function create(body) {
  return Compositions.insertOne(body).then(result => result.insertedId);
}

export function updateOneById(id, body) {
  return Compositions.updateOne(
    { _id: safeObjectId(id) },
    constructSetQuery(body)
  ).then(({ result }) => ({ written: result.nModified, ok: result.ok }));
}

export function deleteOneById(id) {
  return Compositions.deleteOne({ _id: safeObjectId(id) }).then(
    ({ result }) => {
      return { deleted: result.n, ok: result.ok };
    }
  );
}

export function hydrateComposition(
  composition,
  queriesForMovement = [],
  queriesForRecording = []
) {
  return findMovements(
    constructAndQuery([
      constructEqQuery("parent", composition._id),
      ...queriesForMovement
    ])
  )
    .then(movements => hydrateMovements(movements, queriesForRecording))
    .then(movements => {
      return { ...composition, movements };
    });
}

export function hydrateCompositions(
  compositions,
  queriesForMovement = [],
  queriesForRecording = []
) {
  return asyncmap(compositions, composition =>
    hydrateComposition(composition, queriesForMovement, queriesForRecording)
  );
}
