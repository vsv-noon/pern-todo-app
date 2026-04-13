import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';
import vitest from '@vitest/eslint-plugin';

export default defineConfig(
  { ignores: ['dist/**', 'node_modules/**', '*.config.js'] },

  eslint.configs.recommended,

  tseslint.configs.recommended,

  // {
  //   files: ['*.config.js', '.prettierrc.js'],
  //   extends: [tseslint.configs.disableTypeChecked],    
  // },

  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        // projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Node.js специфичные правила
      'no-console': 'warn', // логи в backend норм
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn', // any допустимы в некоторых случаях
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],

      // Prettier в конце (отключает конфликтующие правила)
    },
  },
  // {
  //   "env": {
  //     "node": true,
  //   },
  // },
  // Специальные правила для тестов Vitest
  // {
  //   files: ['**/*.test.ts', '**/*.spec.ts'],
  //   plugins: {
  //     vitest,
  //   },
  //   rules: {
  //     ...vitest.configs.recommended.rules,
  //     'vitest/max-nested-describe': ['error', { max: 3 }],
  //   },
  // },

  prettier, // eslint-plugin-prettier/recommended
);
