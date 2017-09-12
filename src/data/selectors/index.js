import { createSelector } from 'reselect';

const getFlags = (state) => state.flag.get('list');

export const getRandomFlag = createSelector(
  [ getFlags ],
  (flags) => {
    return flags.get(Math.floor(Math.random() * flags.size));
  }
)
