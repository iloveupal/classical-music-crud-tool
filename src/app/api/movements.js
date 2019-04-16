import _pickBy from "lodash/pickBy";

import axios from "axios";

export function createMovement({ title, key, parent }) {
  if (!parent) {
    throw new Error("Parent is required");
  }

  return axios({
    url: "/api/movements/",
    method: "post",
    data: _pickBy({
      title,
      key,
      parent
    })
  }).then(({ data }) => data);
}

export function updateMovement({ id, title, key }) {
  return axios({
    url: `/api/movements/${id}`,
    method: "put",
    data: _pickBy({
      title,
      key
    })
  }).then(({ data }) => data);
}

export function deleteMovement({ id }) {
  return axios({
    url: `/api/movements/${id}`,
    method: "delete"
  }).then(({ data }) => data);
}
