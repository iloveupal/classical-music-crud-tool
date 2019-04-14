import { get } from "server/ioc";

import {
  __find,
  __findOneById,
  __insertOne,
  __updateOneById,
  __deleteOneById
} from "./generics/crud";

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

export const findOneById = __findOneById(Recordings);
export const find = __find(Recordings);
export const create = __insertOne(Recordings);
export const updateOneById = __updateOneById(Recordings);
export const deleteOneById = __deleteOneById(Recordings);
