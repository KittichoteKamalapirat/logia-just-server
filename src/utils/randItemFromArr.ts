import { NATURE_TYPE_VALUES } from '../types/NATURE_TYPE_OBJ';

export const randItemFromArr = (arr: string[]) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index] as string;
};
