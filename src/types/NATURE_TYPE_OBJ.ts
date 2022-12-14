export const NATURE_TYPE_OBJ = {
  // earth
  Forest: 'đ˛',
  // fire
  Fireplace: 'đĨ',
  // wind
  Wind: 'đ',
  Storm: 'âī¸',
  // water
  Ocean: 'đ',
  'Rain Forest': 'đ¨ī¸ đ˛',
  River: '',
  'River Stream': 'đī¸',
  'River Bank': 'đī¸',
  Waterfall: 'đ§',
  Snowfall: 'âī¸',
  // wind + water
  Thunder: 'âī¸',
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

// đ˛ đ đŗ âī¸ đĨ đ đ đ§ đ¨ī¸ â đ§ī¸ âī¸ đŠī¸
