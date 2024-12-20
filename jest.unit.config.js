/* eslint-env node */

module.exports = {
  setupFiles: ['./test-helpers/jest-setup.js'],
  testMatch: [
    '**/tests/**/*.unit.js'
  ],
  collectCoverageFrom: [
    '**/*.{js,vue}',
    '!.nuxt/**',
    '!.output/**',
    '!dist/**',
    '!node_modules/**',
    '!test-helpers/**',
    '!tests/**',
    '!**/*.config.js'
  ],
  coverageReporters: [
    'html'
  ],
  moduleNameMapper: {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^~?@/(.*)$': '<rootDir>/$1'
  },
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  transform: {
    '.*\\.vue$': '@vue/vue3-jest',
    '.*\\.(js|mjs)$': 'babel-jest'
  }
};
