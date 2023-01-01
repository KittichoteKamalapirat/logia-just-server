import { randomTitleAndDes } from '../randomTitleAndDes';

describe('randomTitleAndDes', () => {
  test('should return a random title', () => {
    const result1 = randomTitleAndDes({ hrNum: 10, nature: 'Rain' });
    const result2 = randomTitleAndDes({ hrNum: 10, nature: 'Rain' });
    const result3 = randomTitleAndDes({ hrNum: 10, nature: 'Rain' });

    console.log('resulttt', result1.title);
    console.log('resulttt', result2.title);
    console.log('resulttt', result3.title);
    expect(result1.title).toBeDefined();
    expect(result2.title).toBeDefined();
    expect(result3.title).toBeDefined();
  });
});
