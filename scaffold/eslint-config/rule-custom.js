// rules for *.js, *.jsx, *.ts, *.tsx
const jsRules = {
  'class-methods-use-this': 0,
  'func-call-spacing': ['error', 'never'],
  'func-names': 0,
  'key-spacing': ['error'],
  'lines-between-class-members': 0,
  'max-len': [
    'error',
    {
      code: 100,
      comments: 80,
      tabWidth: 2,
      ignorePattern: (
        [
          /^\s*\*\s*@\w+/,     // ignore '* @param ...'
          /^\s*\/\/\s*eslint-disable-next-line\s/,   // ignore '// eslint-disable-next-line ...'
          /^\s*\/\//,          // ignore line comment
        ]
          .map(r => '(?:' + r.source + ')')
          .join('|')
      ),
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }
  ],
  'new-cap': ['error', { newIsCap: true, capIsNew: true }],
  'no-await-in-loop': 0,
  'no-bitwise': 0,
  'no-console': 0,
  'no-continue': 0,
  'no-cond-assign': ['error', 'always'],
  'no-inner-declarations': 'error',
  'no-mixed-operators': 'error',
  'no-mixed-spaces-and-tabs': 'error',
  'no-multi-spaces': ['error', { ignoreEOLComments: true }],
  'no-param-reassign': ['error', { props: true }],
  'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  'no-restricted-syntax': 0,
  'no-return-assign': ['error', 'always'],
  'no-throw-literal': 0,
  'no-underscore-dangle': 0,
  'prefer-destructuring': 0,
  'quotes': ['error', 'single'],
  'semi': ['error', 'never'],
  'space-before-blocks': [
    'error',
    {
      functions: 'always',
      keywords: 'always',
      classes: 'always',
    }
  ],
  'space-before-function-paren': 0,
  'spaced-comment': ['error', 'always'],
  'space-in-parens': ['error', 'never'],
  'space-infix-ops': [
    'error',
    {
      int32Hint: false,
    }
  ],
  'space-unary-ops': [
    'error',
    {
      words: true,
      nonwords: false,
    }
  ],
}


// rules for *.jsx, *.tsx
const jsxRules = {
  'react/display-name': 'error',
  'react/jsx-boolean-value': ['error', 'always'],
  'react/jsx-closing-bracket-location': [
    'error',
    {
      nonEmpty: 'tag-aligned',
      selfClosing: 'line-aligned',
    }
  ],
  'react/jsx-curly-newline': [
    'error',
    {
      multiline: 'consistent',
      singleline: 'consistent',
    }
  ],
  'react/jsx-curly-spacing': [
    'error',
    {
      when: 'always',
      children: true,
      allowMultiline: true,
      spacing: {
        objectLiterals: 'never',
      }
    }
  ],
  'react/jsx-equals-spacing': ['error', 'never'],
  'react/jsx-filename-extension': [
    'error',
    {
      extensions: ['.jsx', '.tsx'],
    },
  ],
  'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
  'react/jsx-fragments': ['error', 'element'],
  'react/jsx-indent-props': ['error', 2],
  'react/jsx-indent': [
    'error',
    2,
    {
      checkAttributes: true,
      indentLogicalExpressions: true,
    }
  ],
  'react/jsx-max-props-per-line': [
    'error',
    {
      maximum: 1,
      when: 'multiline',
    }
  ],
  'react/jsx-no-bind': [
    'error',
    {
      ignoreDOMComponents: false,
      ignoreRefs: false,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false,
    }
  ],
  'react/jsx-no-duplicate-props': [
    'error',
    {
      ignoreCase: true,
    }
  ],
  'react/jsx-props-no-multi-spaces': 'error',
  'react/jsx-pascal-case': 'error',
  'react/jsx-tag-spacing': [
    'error',
    {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never',
    },
  ],
  'react/jsx-wrap-multilines': [
    'error',
    {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens',
      logical: 'parens',
      prop: 'ignore'
    },
  ],
  'react/self-closing-comp': 'error',
}


// rules for *.ts, *.tsx
const tsRules = {
  '@typescript-eslint/interface-name-prefix': 0,
  '@typescript-eslint/no-empty-function': 0,
  '@typescript-eslint/no-empty-interface': 0,
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/no-non-null-assertion': 0,
  '@typescript-eslint/no-redeclare': [
    'warn',
    {
      ignoreDeclarationMerge: true,
    }
  ],
  '@typescript-eslint/no-this-alias': [
    'error',
    {
      allowDestructuring: true, // Allow `const { props, state } = this`; false by default
      allowedNames: ['self']    // Allow `const self = this`; `[]` by default
    }
  ],
  '@typescript-eslint/space-before-function-paren': [
    'error',
    {
      named: 'never',
      anonymous: 'always',
      asyncArrow: 'always',
    }
  ],
}


module.exports = { jsRules, jsxRules, tsRules }
