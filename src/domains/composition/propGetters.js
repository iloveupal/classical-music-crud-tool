import _get from "lodash/get";

export function getTitle(composition) {
  return _get(composition, "title");
}

export function getComposer(composition) {
  return _get(composition, "composer");
}

export function getMovements(composition) {
  return _get(composition, "movements", []);
}
