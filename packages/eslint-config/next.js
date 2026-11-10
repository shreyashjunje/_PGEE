import nextVitals from 'eslint-config-next/core-web-vitals';
import { defineConfig } from 'eslint/config';
import base from './base.js';

/** Config for apps/web. */
export default defineConfig(nextVitals, base);
