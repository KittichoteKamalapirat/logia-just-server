import { adjArr, purposeArr } from '../constants';
import { randItemFromArr } from './randItemFromArr';
import { randItemsFromArr } from './randItemsFromArr';

export const randomTitleAndDes = ({
  hrNum,
  keyword,
  emoji,
}: {
  hrNum: number;
  keyword: string;
  emoji: string;
}) => {
  // template
  // {num} hours of {nature} sound | {effect1}, {effect2}, {effect3}, {effect4},
  // nature: Rain, snowfall, fire, storm, bird, wind, river, water, thunder
  // effect: Relaxing, Refreshing, Soothing, Calm, Chill
  // purpose: Sleep, Study, Work, Stress Relief, Deep Sleep, Meditation, Yoga

  const adj = randItemFromArr(adjArr);
  const purposes = randItemsFromArr(purposeArr);
  const purposeStr = purposes.join(', ');

  const title = `${emoji} ${hrNum} Hours of ${adj} ${keyword} Sound | ${purposeStr},...`;
  const description = `
- ${title}.

Don't forget it may be useful to share with family or friends too.
Have a good day/night everyone and thank you for watching! 

► If you enjoy my videos please like and subscribe to my channel, thank you!
#naturesound #ambience #sleep #relax #${keyword}
`;

  return { title, description };
};
