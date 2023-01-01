import { natureArr } from '../../types/NATURE_TYPE_OBJ';
import { randItemFromArr } from '../randItemFromArr';

describe('randItemFromArr', () => {
  const arr = natureArr;

  const returnedResult1 = randItemFromArr(arr);
  const returnedResult2 = randItemFromArr(arr);
  const returnedResult3 = randItemFromArr(arr);
  const returnedResult4 = randItemFromArr(arr);

  const isIncluded1 = arr.includes(returnedResult1);
  const isIncluded2 = arr.includes(returnedResult2);
  const isIncluded3 = arr.includes(returnedResult3);
  const isIncluded4 = arr.includes(returnedResult4);

  test('should return a random item', () => {
    expect(isIncluded1).toEqual(true);
    expect(isIncluded2).toEqual(true);
    expect(isIncluded3).toEqual(true);
    expect(isIncluded4).toEqual(true);
  });
});
