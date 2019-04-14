import { constructTextQuery } from "server/utils/database";

export function buildTextQuery(text) {
  return constructTextQuery(text);
}
