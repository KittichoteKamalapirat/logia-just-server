import { adjArr, purposeArr } from '../constants';
import { randItemFromArr } from './randItemFromArr';
import { randItemsFromArr } from './randItemsFromArr';

export const randomTitle = ({ hrNum, nature }: { hrNum: number; nature }) => {
  // template
  // {num} hours of {nature} sound | {effect1}, {effect2}, {effect3}, {effect4},
  // nature: Rain, snowfall, fire, storm, bird, wind, river, water, thunder
  // effect: Relaxing, Refreshing, Soothing, Calm, Chill
  // purpose: Sleep, Study, Work, Stress Relief, Deep Sleep, Meditation, Yoga

  const adj = randItemFromArr(adjArr);
  const purposes = randItemsFromArr(purposeArr);
  const purposeStr = purposes.join(', ');

  const title = `${hrNum} Hours of ${adj} ${nature} Sound | ${purposeStr},...`;

  return title;
};
