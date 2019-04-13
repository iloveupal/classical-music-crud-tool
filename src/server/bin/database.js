import assert from "assert";
import { MongoClient } from "mongodb";

export default function connectToDb(url, db) {
  return new MongoClient(url, { useNewUrlParser: true })
    .connect()
    .then(client => client.db(db))
    .catch(error => assert.fail(error));
}
