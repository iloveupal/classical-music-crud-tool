import { constructTextQuery, constructEqQuery } from "server/utils/database";

export function buildTextQuery(text) {
  return constructTextQuery(text);
}

export function buildKeyQuery(key) {
  return constructEqQuery("key", key);
}

export function buildParentQuery(parent) {
  return constructEqQuery("parent", parent);
}
