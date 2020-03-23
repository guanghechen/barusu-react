module.exports = {
  root: true,
  extends: [
    '@barusu-react/eslint-config'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  ignorePatterns: [
    'rollup.config.js'
  ],
  rules: {

  }
}
