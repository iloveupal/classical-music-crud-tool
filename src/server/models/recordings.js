import { get } from "server/ioc";

import {
  safeObjectId,
  constructEqQuery,
  constructAndQuery
} from "server/utils/database";

const db = get("db");

export const Recordings = db.collection("recordings");

export function find(query) {
  return Recordings.find(query).toArray();
}
