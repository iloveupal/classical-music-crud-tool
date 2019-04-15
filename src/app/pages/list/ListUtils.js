import _entries from "lodash/entries";

import Joi from "joi";
import { compositionsFilterSchema } from "domains/composition/schemas";

export function parseSearchString(str) {
  if (!str) {
    return Promise.resolve(null);
  }

  let filters = str.split(";").reduce((acc, filter) => {
    const filterParts = filter.split("=");

    if (filterParts.length !== 2) {
      return acc;
    }

    const [filterName, filterValue] = filterParts;

    acc[filterName.toLowerCase()] = filterValue;

    return acc;
  }, {});

  if (!Object.keys(filters).length) {
    filters = {
      text: str
    };
  }

  return Joi.validate(filters, compositionsFilterSchema).then(() => filters);
}

export function buildFiltersKey(filters) {
  return _entries(filters).reduce((acc, [key, value]) => {
    return acc + `${key}=${value}`;
  }, "");
}
