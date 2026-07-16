import js from '@eslint/js';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
];