import { get } from "server/ioc";
import {
  safeObjectId,
  constructEqQuery,
  constructAndQuery
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
