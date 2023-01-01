import { searchFreeSound } from '../searchFreeSound';

describe('searchFreeSound', async () => {
  const returnedResult = await searchFreeSound({ query: 'xx' });

  const expectedResult = '09/11/2022 00:01';

  console.log('returnedResult', returnedResult);

  test('should return the correct formatted date', () => {
    expect(returnedResult).toEqual(expectedResult);
  });
});
