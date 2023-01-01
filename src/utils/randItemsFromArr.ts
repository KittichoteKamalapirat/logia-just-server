import { randomIntFromInterval } from './randomIntFromInterval';

export const randItemsFromArr = (arr: string[]) => {
  // shuffle your list with the sort function:
  const shuffledList = arr.sort(() => Math.random() - 0.5);

  // generate a size for the new list
  const arrLen = arr.length;
  const minSize = Math.min(arrLen, 3);
  const maxSize = Math.min(arrLen, 5);
  const newListSize = randomIntFromInterval(minSize, maxSize); // get 3-5 items

  // pick the first "newListSize" elements from "shuffledList"
  const newList = shuffledList.slice(0, newListSize);

  return newList;
};
