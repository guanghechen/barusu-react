const customRules = require('./rule-custom')


module.exports = {
  extends: ['react-app'],
  overrides: [
    {
      files: ['**/*{.ts,tsx}'],
      extends: [
        'react-app',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint'
      ],
      rules: {
        ...customRules.tsRules,
      }
    },
  ],
  ignorePatterns: [
    '**/test/cases/**',
    '**/__test__/cases/**',
    '**/node_modules/**',
    '**/lib/**',
    '**/dist/**',
    '**/build/**',
    '**/target/**',
    '**/vendor/**',
    '**/release/**',
    '**/example/**',
    '**/demo/**',
    '**/doc/**',
    '**/tmp/**',
    '**/__tmp__/**',
    '**/coverage/**',
    '**/*.styl.d.ts',
    '*.tsbuildinfo',
    '.eslintrc.js',
  ],
  rules: {
    ...customRules.jsRules,
    ...customRules.jsxRules,
  }
}
