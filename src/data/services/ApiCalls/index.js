import apisauce from 'apisauce';

import Flags from './json/flags';

export function fetchFlags() {
  return new Promise((resolve, reject) => {
    resolve(Flags);
  });
}
