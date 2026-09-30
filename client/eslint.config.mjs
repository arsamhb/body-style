import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import pluginQuery from '@tanstack/eslint-plugin-query';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
  globalIgnores([
    'src/lib/axiosInstance.ts',
    'node_modules',
    'dist',
    'build',
    '.next',
    'out',
    'next-env.d.ts',
  ]),

  ...nextVitals,
  ...nextTs,
  ...pluginQuery.configs['flat/recommended'],
  prettierRecommended,

  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'lf' }],
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-ignore': false,
          'ts-expect-error': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['src/hoc/**', '**/hook.mutation.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  { files: ['**/hook.mutation.tsx'], rules: { 'react-hooks/rules-of-hooks': 'off' } },
]);

export default eslintConfig;
