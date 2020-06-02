module.exports = {
  extends: [
    require.resolve('@gpn-prototypes/frontend-configs/eslintrc')
  ],
  overrides: [
    {
      files: [
        "./src/**/*.ts"
      ],
      rules: {
        "ordered-imports": "off",
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              "@vega/*",
              "**/components/**/*",
              "**/contexts/**/*",
              "**/dashboard/**/*",
              "**/ui/**/*",
              "**/utils/**/*",
              "**/widget-helpers/**/*",
              "**/widgets/**/*"
            ]
          }
        ]
      }
    },
    {
      files: [
        "./src/**/index.stories.tsx"
      ],
      rules: {
        "import/no-default-export": ["off"]
      }
    }
  ],
};
