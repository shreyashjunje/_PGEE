import next from '@pg/eslint-config/next';

const config = [
  ...next,
  // Lets the Next plugin find the app when ESLint runs from the repo root (lint-staged).
  { settings: { next: { rootDir: import.meta.dirname } } },
];

export default config;
