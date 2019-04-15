import _get from "lodash/get";

export function getTitle(movement) {
  return _get(movement, "title");
}

export function getKey(movement) {
  return _get(movement, "key");
}

export function getRecordings(movement) {
  return _get(movement, "recordings", []);
}
