import { asyncmap } from "asyncbox";

import { get } from "server/ioc";
import { constructEqQuery, constructAndQuery } from "server/utils/database";

import {
  __find,
  __findOneById,
  __insertOne,
  __updateOneById,
  __deleteOneById
} from "./generics/crud";

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

export const findOneById = __findOneById(Compositions);
export const find = __find(Compositions);
export const create = __insertOne(Compositions);
export const updateOneById = __updateOneById(Compositions);
export const deleteOneById = __deleteOneById(Compositions);

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
