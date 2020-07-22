module.exports = {
  extends: [require.resolve('@gpn-prototypes/frontend-configs/eslintrc')],
  overrides: [
    {
      files: ['./src/**/*.ts'],
      rules: {
        'ordered-imports': 'off',
      },
    },
    {
      files: ['./src/**/index.stories.tsx'],
      rules: {
        'import/no-default-export': ['off'],
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@vega', './src/']],
        extensions: ['.ts', '.tsx', '.json'],
      },
    },
  },
};
