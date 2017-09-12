export const FLAGS_REQUEST = 'FLAGS_REQUEST';
export function flagsRequest(data) {
  return {
    type: FLAGS_REQUEST,
    payload: data,
  };
}

export const FLAGS_SUCCESS = 'FLAGS_SUCCESS';
export function flagsSuccess(data) {
  return {
    type: FLAGS_SUCCESS,
    payload: data,
  };
}

export default {
  flagsRequest,
  flagsSuccess,
};
