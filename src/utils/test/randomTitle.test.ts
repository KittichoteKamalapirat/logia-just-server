import { randomTitle } from '../randomTitle';

describe('randomTitle', () => {
  test('should return a random title', () => {
    const result1 = randomTitle({ hrNum: 10, nature: 'Rain' });
    const result2 = randomTitle({ hrNum: 10, nature: 'Rain' });
    const result3 = randomTitle({ hrNum: 10, nature: 'Rain' });

    console.log('resulttt', result1);
    console.log('resulttt', result2);
    console.log('resulttt', result3);
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result3).toBeDefined();
  });
});
