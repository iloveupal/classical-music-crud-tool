import { get } from "server/ioc";

import {
  safeObjectId,
  constructEqQuery,
  constructAndQuery
} from "server/utils/database";

const db = get("db");

export const Recordings = db.collection("recordings");

Recordings.createIndexes([
  {
    key: {
      parent: 1
    },
    name: "parent-index"
  },
  {
    key: {
      year: 1
    },
    name: "year-index"
  },
  {
    key: {
      "performers.name": 1
    },
    name: "performer-name-index"
  },
  {
    key: {
      "performers.type": 1
    },
    name: "performer-type-index"
  },
  {
    key: {
      "performers.name": 1,
      "performers.type": 1
    },
    name: "performers-index"
  }
]);

export function find(query) {
  return Recordings.find(query).toArray();
}
