import _get from "lodash/get";

export function getPerformers(recording) {
  return _get(recording, "performers", []);
}

export function getPerformerName(performer) {
  return _get(performer, "name");
}

export function getPerformerType(performer) {
  return _get(performer, "type");
}

export function getYear(recording) {
  return _get(recording, "year");
}
