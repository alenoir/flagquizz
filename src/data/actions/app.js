export const STARTUP_REQUEST = 'STARTUP_REQUEST';
export function startupRequest(data) {
  return {
    type: STARTUP_REQUEST,
    payload: data,
  };
}

export const STARTUP_SUCCESS = 'STARTUP_SUCCESS';
export function startupSuccess(data) {
  return {
    type: STARTUP_SUCCESS,
    payload: data,
  };
}

export const APP_UPDATE_START = 'APP_UPDATE_START';
export function updateStart() {
  return {
    type: APP_UPDATE_START,
    payload: {},
  };
}

export const APP_UPDATE_END = 'APP_UPDATE_END';
export function updateEnd() {
  return {
    type: APP_UPDATE_END,
    payload: {},
  };
}

export const APP_SET_STATUSBARSTYLE = 'APP_SET_STATUSBARSTYLE';
export function setStatusBarStyle(style) {
  return {
    type: APP_SET_STATUSBARSTYLE,
    payload: {
      style,
    },
  };
}

export const APP_SET_LOADING = 'APP_SET_LOADING';
export function setLoading(loading) {
  return {
    type: APP_SET_LOADING,
    payload: {
      loading,
    },
  };
}

export default {
  updateStart,
  updateEnd,
  setLoading,
};
