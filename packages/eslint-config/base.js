import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

/**
 * Base config for every workspace.
 *
 * @pg/database is blocked here, so it is denied by default in every app and
 * package (web, mobile, api-client, ...). Only apps/api lifts the rule, via
 * the "nest" config.
 */
export default defineConfig(
  globalIgnores(['dist/**', '.next/**', 'coverage/**', 'src/generated/**', 'next-env.d.ts']),
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true },
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@pg/database', '@pg/database/*'],
              message:
                'Only apps/api may import @pg/database. Call the API through @pg/api-client.',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
