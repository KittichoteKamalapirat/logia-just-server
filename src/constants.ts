import { dirname } from 'path';

// ref: https://mixedanalytics.com/youtube-video-category-id-list/
export const categoryIds = {
  Entertainment: '24',
  Music: '10',
  Education: '27',
  ScienceTechnology: '28',
};

// pick one
export const adjArr = [
  'Relaxing',
  'Refreshing',
  'Soothing',
  'Calm',
  'Chill',
  'Peaceful',
];
export const purposeArr = [
  'Study',
  'Work',
  'Stress',
  'Relief',
  'Deep Sleep',
  'Meditation',
  'Yoga',
];

export const distDir = dirname(require.main.filename);
