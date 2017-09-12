export const SET_LOCALE_START = 'SET_LOCALE_START';
export const SET_LOCALE_SUCCESS = 'SET_LOCALE_SUCCESS';
export const SET_LOCALE_ERROR = 'SET_LOCALE_ERROR';

export function setLocale({ locale }) {
  if (process.env.BROWSER) {
    const maxAge = 3650 * 24 * 3600; // 10 years in seconds
    document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
  }
  return {
    type: SET_LOCALE_SUCCESS,
    payload: {
      locale,
    },
  };
}
