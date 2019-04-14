import _take from "lodash/take";

export const wrapArrayResult = ({ offset, limit }) => result => {
  return {
    success: true,
    errors: [],
    result: _take(result.slice(offset), limit),
    count: result.length
  };
};

export const wrapResult = result => {
  return {
    success: true,
    errors: [],
    result
  };
};

export const wrapErrors = errors => {
  return {
    success: false,
    errors
  };
};
