module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    // 'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // Make sure this is always the last element in the array.
  ],
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/react-in-jsx-scope': 'off',
    // 'jsx-a11y/accessible-emoji': 'off',
    // 'jsx-a11y/no-static-element-interactions': ['off'],
    // 'jsx-a11y/click-events-have-key-events': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    // 'simple-import-sort/imports': 'warn', // 引入顺序排序功能
    'simple-import-sort/exports': 'error', // 导出顺序排序

    //解决ts中，本身是可以有空的构造函数的误判问题 START
    'no-useless-constructor': 'off',
    // '@typescript-eslint/no-useless-constructor': 'error',
    'no-unused-vars': ['error', { varsIgnorePattern: '.*', args: 'none' }],
    '@typescript-eslint/no-unused-vars': 'off',
    'no-empty-function': 'off',
    //解决导出类型时，no-undef报错问题
    'no-undef': 'off',
    'import/prefer-default-export': 'off',
    'no-import-assign': 'off',
  },
};
