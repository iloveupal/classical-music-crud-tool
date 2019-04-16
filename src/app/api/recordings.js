import _pickBy from "lodash/pickBy";

import axios from "axios";

export function uploadRecording(file) {
  // handle file upload later blabla
  return Promise.resolve({
    success: true,
    errors: [],
    result: {
      _id: "5cb59f2b5206be3084cb5674",
      metadata: {
        artists: ["Svyatoslav Richter"],
        year: 1994
      }
    }
  });
}

export function createRecording({ performers, year, parent }) {
  if (!parent) {
    throw new Error("Parent is required");
  }

  return axios({
    url: "/api/recordings/",
    method: "post",
    data: _pickBy({
      performers,
      year,
      parent
    })
  }).then(({ data }) => data);
}

export function updateRecording({ id, performers, year }) {
  return axios({
    url: `/api/recordings/${id}`,
    method: "put",
    data: _pickBy({
      performers,
      year
    })
  }).then(({ data }) => data);
}

export function deleteRecording({ id }) {
  return axios({
    url: `/api/recordings/${id}`,
    method: "delete"
  }).then(({ data }) => data);
}
