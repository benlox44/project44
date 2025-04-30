import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default tseslint.config(
  {
    ignores: ['.next', 'dist', 'node_modules'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: eslintPluginImport,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      '@typescript-eslint': eslintPluginTypescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      // Typescript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': ['error'],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' },
      ],

      // Import order and enforcement of alias
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Block relative imports (force @/)
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', './*'],
        },
      ],

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React (Next.js allows omitting react in scope)
      'react/react-in-jsx-scope': 'off',
    },
  },
);
