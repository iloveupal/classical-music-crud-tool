import _pickBy from "lodash/pickBy";

import axios from "axios";

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

// it doesn't require id, just for this test assignment.
// in real world, we would've linked the file to a recording via id somehow.
export const getApiRecordingUploadUrl = id => `/api/recordings/upload`;

export function deleteRecording({ id }) {
  return axios({
    url: getApiRecordingUploadUrl(id),
    method: "delete"
  }).then(({ data }) => data);
}
