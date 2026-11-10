import { defineConfig } from 'eslint/config';
import base from './base.js';

/** Config for apps/api: the only workspace allowed to import @pg/database. */
export default defineConfig(base, {
  files: ['**/*.ts'],
  rules: {
    'no-restricted-imports': 'off',
  },
});
