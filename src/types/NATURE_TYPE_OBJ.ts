export const NATURE_TYPE_OBJ = {
  // earth
  Forest: '🌲',
  // fire
  Fireplace: '🔥',
  // wind
  Wind: '🍃',
  Storm: '⛈️',
  // water
  Ocean: '🌊',
  'Rain Forest': '🌨️ 🌲',
  River: '',
  'River Stream': '🏞️',
  'River Bank': '🏞️',
  Waterfall: '💧',
  Snowfall: '❄️',
  // wind + water
  Thunder: '⛈️',
} as const;

export type NATURE_TYPE_VALUES = keyof typeof NATURE_TYPE_OBJ;
export type NATURE_TYPE_EMOJIS = typeof NATURE_TYPE_OBJ[NATURE_TYPE_VALUES];

export const natureArr = Object.keys(NATURE_TYPE_OBJ).map(
  (key) => key as NATURE_TYPE_VALUES,
);

interface NatureOption {
  value: NATURE_TYPE_VALUES;
  label: NATURE_TYPE_EMOJIS;
}
export const natureTypeOptions: NatureOption[] = Object.keys(
  NATURE_TYPE_OBJ,
).map((key) => ({
  value: key as NATURE_TYPE_VALUES,
  label: NATURE_TYPE_OBJ[key as NATURE_TYPE_VALUES],
}));

// 🌲 🍂 🌳 ❄️ 🔥 🍃 🌊 💧 🌨️ ☔ 🌧️ ⛈️ 🌩️
