module.exports = {
  root: true,
  extends: ['react-app'],
  plugins: [
    '@typescript-eslint',
    'import',
    'flowtype',
    'jsx-a11y',
    'react',
    'react-hooks',
    'prettier'
  ],
  overrides: [
    {
      files: ['**/*{.ts,tsx}'],
      extends: [
        'react-app',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },

        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-this-alias': [
          'error',
          {
            'allowDestructuring': true, // Allow `const { props, state } = this`; false by default
            'allowedNames': ['self']    // Allow `const self = this`; `[]` by default
          }
        ],
        '@typescript-eslint/space-before-function-paren': [
          'error',
          {
            'named': 'never',
            'anonymous': 'always',
            'asyncArrow': 'always',
          }
        ],
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
  ],
  rules: {
    'class-methods-use-this': 0,
    'func-call-spacing': ['error', 'never'],
    'func-names': 0,
    'key-spacing': ['error'],
    'lines-between-class-members': 0,
    'max-len': [
      'error',
      {
        'code': 100,
        'comments': 100,
        'tabWidth': 2,
        'ignorePattern': /^(?:\s*\/\/\s*eslint-disable-next-line\s)|(?:\s*\*\s*@\w+)|(?:\s*\/\/)/.source,
        'ignoreTrailingComments': true,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
      }
    ],
    'new-cap': ['error', { 'newIsCap': true, 'capIsNew': true }],
    'no-await-in-loop': 0,
    'no-bitwise': 0,
    'no-console': 0,
    'no-continue': 0,
    'no-cond-assign': ['error', 'always'],
    'no-inner-declarations': 'error',
    'no-mixed-operators': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
    'no-param-reassign': ['error', { 'props': true }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-restricted-syntax': 0,
    'no-return-assign': ['error', 'always'],
    'no-throw-literal': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'quotes': ['error', 'single'],
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-indent': [2, 2],
    'semi': ['error', 'never'],
    'space-before-blocks': [
      'error',
      {
        'functions': 'always',
        'keywords': 'always',
        'classes': 'always',
      }
    ],
    'space-before-function-paren': 0,
    'spaced-comment': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': ['error', { 'int32Hint': false }],
    'space-unary-ops': ['error', { 'words': true, 'nonwords': false }],
  }
}
