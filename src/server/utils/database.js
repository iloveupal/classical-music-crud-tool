import { ObjectId } from "mongodb";

export function safeObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (e) {
    return id;
  }
}

export function constructAndQuery(conditions) {
  return {
    $and: conditions
  };
}

export function constructEqQuery(field, value) {
  return {
    [field]: { $eq: value }
  };
}
