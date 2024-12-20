/* eslint-env node */

module.exports = {
  setupFiles: ['./test-helpers/jest-setup.js'],
  testMatch: [
    '**/tests/**/*.e2e.js'
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
  },
  globals: {
    baseUrl: 'http://localhost:3000/',
    browserOptions: {
      headless: true,
      windowWidth: 1366,
      windowHeight: 768
    }
  }
};
