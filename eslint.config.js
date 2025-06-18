import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
    
  {
    files: ['**/*.js'],
    
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Определяем глобальные переменные
      globals: {
        ...globals.browser, 
        ...globals.node, 
      },
    },
    
    rules: {
      'no-console': 'off',
    },
  }
];
