import _pickBy from "lodash/pickBy";

import axios from "axios";
import qs from "qs";

export function listCompositions({ search, offset, limit }) {
  return axios({
    url: "/api/compositions",
    method: "get",
    params: _pickBy({ search, offset, limit }),
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: "brackets" });
    }
  }).then(({ data }) => data);
}

export function deleteComposition({ id }) {
  return axios({
    url: `/api/compositions/${id}`,
    method: "delete"
  }).then(({ data }) => data);
}
