/* eslint-env node */

module.exports = {
  'extends': [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss'
  ],
  'ignoreFiles': [
    '**/*.js'
  ],
  'rules': {
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'indentation': [
      2,
      {
        baseIndentLevel: 1
      }
    ],
    'selector-type-no-unknown': null,
    'string-quotes': 'single',
    'at-rule-no-unknown': [
      true,
      {
        'ignoreAtRules': [
          'extend',
          'at-root',
          'debug',
          'warn',
          'error',
          'if',
          'else',
          'for',
          'each',
          'while',
          'mixin',
          'include',
          'content',
          'return',
          'function'
        ]
      }
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        'except': [
          'blockless-after-blockless',
          'blockless-after-same-name-blockless',
          'first-nested'
        ],
        'ignore': ['after-comment'],
        'ignoreAtRules': [
          'debug',
          'warn',
          'error',
          'content',
          'return',
          'else'
        ]
      }
    ],
    'block-closing-brace-newline-after': [
      'always',
      {
        'ignoreAtRules': [
          'if',
          'else'
        ]
      }
    ],
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/double-slash-comment-empty-line-before': null,
    'scss/at-import-partial-extension': 'never',
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'scss/no-global-function-names': null,
    'scss/at-rule-conditional-no-parentheses': null,
    'alpha-value-notation': 'number',
    'font-family-name-quotes': 'always-unless-keyword',
    'selector-class-pattern': null,
    'color-function-notation': 'legacy',
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null
  }
};
