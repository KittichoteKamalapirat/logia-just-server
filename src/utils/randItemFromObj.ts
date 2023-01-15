import { NATURE_TYPE_OBJ } from '../types/NATURE_TYPE_OBJ';

export const getRandomSearch = () => {
  const keys = Object.keys(NATURE_TYPE_OBJ);
  const randomKey = (keys.length * Math.random()) << 0;
  return NATURE_TYPE_OBJ[keys[randomKey]];
};
