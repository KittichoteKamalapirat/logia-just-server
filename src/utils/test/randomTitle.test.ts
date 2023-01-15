import { randomTitleAndDes } from '../randomTitleAndDes';

describe('randomTitleAndDes', () => {
  test('should return a random title', () => {
    const result1 = randomTitleAndDes({
      hrNum: 10,
      keyword: 'Rain',
      emoji: '⛈️',
    });
    const result2 = randomTitleAndDes({
      hrNum: 10,
      keyword: 'Forest',
      emoji: '🌲',
    });
    const result3 = randomTitleAndDes({
      hrNum: 10,
      keyword: 'Wave',
      emoji: '🌊',
    });

    expect(result1.title).toBeDefined();
    expect(result2.title).toBeDefined();
    expect(result3.title).toBeDefined();
  });
});
