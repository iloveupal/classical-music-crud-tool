import { constructTextQuery, constructEqQuery } from "server/utils/database";

export function buildPerformerQuery(performer) {
  return constructEqQuery("performers.name", performer);
}

export function buildTypeQuery(type) {
  return constructEqQuery("performers.type", type);
}

export function buildParentQuery(parent) {
  return constructEqQuery("parent", parent);
}

export function buildYearQuery(year) {
  return constructEqQuery("year", year);
}
