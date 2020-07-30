module.exports = {
  extends: [require.resolve('@gpn-prototypes/frontend-configs/.eslintrc')],
  overrides: [
    {
      files: ['./src/**/index.stories.tsx'],
      rules: {
        'import/no-default-export': ['off'],
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@vega', './src/']],
        extensions: ['.ts', '.tsx', '.json'],
      },
    },
  },
};
