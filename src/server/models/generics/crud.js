import { safeObjectId, constructSetQuery } from "server/utils/database";

export const __find = collection => query => collection.find(query).toArray();

export const __findOneById = collection => id =>
  collection.findOne({ _id: safeObjectId(id) });

export const __insertOne = collection => body =>
  collection.insertOne(body).then(result => result.insertedId);

export const __updateOneById = collection => (id, body) =>
  collection
    .updateOne({ _id: safeObjectId(id) }, constructSetQuery(body))
    .then(({ result }) => {
      return { deleted: result.n, ok: result.ok };
    });

export const __deleteOneById = collection => id =>
  collection.deleteOne({ _id: safeObjectId(id) }).then(({ result }) => {
    return { deleted: result.n, ok: result.ok };
  });
