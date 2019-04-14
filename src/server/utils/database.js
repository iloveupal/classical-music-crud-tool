import _isUndefined from "lodash/isUndefined";
import _filter from "lodash/filter";
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
    $and: _filter(conditions)
  };
}

export function constructEqQuery(field, value) {
  if (_isUndefined(value)) {
    return null;
  }

  return {
    [field]: { $eq: value }
  };
}

export function constructTextQuery(text) {
  if (_isUndefined(text)) {
    return null;
  }

  return {
    $text: {
      $search: text
    }
  };
}

export function constructSetQuery(operations) {
  return {
    $set: operations
  };
}
