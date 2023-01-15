// export const NATURE_TYPE_OBJ = {
//   // earth
//   Forest: '🌲',
//   // fire
//   Fireplace: '🔥',
//   // wind
//   Wind: '🍃',
//   Storm: '⛈️',
//   // water
//   Ocean: '🌊',
//   'Rain Forest': '🌨️ 🌲',
//   River: '',
//   'River Stream': '🏞️',
//   'River Bank': '🏞️',
//   Waterfall: '💧',
//   Snowfall: '❄️',
//   // wind + water
//   Thunder: '⛈️',
// } as const;

export interface SearchText {
  youtubeKeyword: string;
  pexelQuery: string;
  freeSoundQuery: string;
  emoji: string;
}
export const NATURE_TYPE_OBJ: { [key: string]: SearchText } = {
  // earth
  // rain_forest: {
  //   youtubeKeyword: 'Rain',
  //   pexelQuery: 'rainforest',
  //   freeSoundQuery: 'rain forest',
  //   emoji: '🌨️ 🌲',
  // },
  // city_rain: {
  //   youtubeKeyword: 'City Rain',
  //   pexelQuery: 'city rain',
  //   freeSoundQuery: 'city rain',
  //   emoji: '🏢 🌨️ ',
  // },
  forest: {
    youtubeKeyword: 'Forest',
    pexelQuery: 'forest',
    freeSoundQuery: ' summer forest',
    emoji: '🌲',
  },
  // fire
  fireplace: {
    youtubeKeyword: 'Fireplace',
    // pexelQuery: 'campfire', // image
    pexelQuery: 'fireplace', // video
    freeSoundQuery: 'crackling fireplace',
    emoji: '🔥',
  },
  // wind
  // Wind: '🍃',
  // storm: '⛈️',
  // water
  ocean: {
    youtubeKeyword: 'Wave',
    pexelQuery: 'beach',
    freeSoundQuery: 'seaside',
    emoji: '🌊',
  },
  stream: {
    youtubeKeyword: 'Water Stream',
    pexelQuery: 'stream',
    freeSoundQuery: 'gentle stream',
    emoji: '🏞️',
  },
  // 'River Stream': '🏞️',
  // 'River Bank': '🏞️',
  waterfall: {
    youtubeKeyword: 'Waterfall',
    pexelQuery: 'waterfall',
    freeSoundQuery: 'waterfall',
    emoji: '🏞️',
  },
  // Snowfall: '❄️',
  // wind + water
  // Thunder: '⛈️',
} as const;

export type NATURE_TYPE_VALUES = keyof typeof NATURE_TYPE_OBJ;
// export type NATURE_TYPE_EMOJIS = typeof NATURE_TYPE_OBJ[NATURE_TYPE_VALUES];

export const natureArr = Object.keys(NATURE_TYPE_OBJ).map(
  (key) => key as string,
);

// interface NatureOption {
//   value: NATURE_TYPE_VALUES;
//   label: NATURE_TYPE_EMOJIS;
// }
// export const natureTypeOptions: NatureOption[] = Object.keys(
//   NATURE_TYPE_OBJ,
// ).map((key) => ({
//   value: key as NATURE_TYPE_VALUES,
//   label: NATURE_TYPE_OBJ[key as NATURE_TYPE_VALUES],
// }));

// 🌲 🍂 🌳 ❄️ 🔥 🍃 🌊 💧 🌨️ ☔ 🌧️ ⛈️ 🌩️
