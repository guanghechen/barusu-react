const path = require('path')
const { compilerOptions } = require('./tsconfig')


const moduleNameMapper = {}
for (const moduleName of Object.getOwnPropertyNames(compilerOptions.paths)) {
  const paths = compilerOptions.paths[moduleName]
    .map(p => path.resolve(__dirname, p))
  let pattern = '^' + moduleName.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&') + '$'
  moduleNameMapper[pattern] = paths.length === 1 ? paths[0] : paths
}


module.exports = {
  bail: true,
  verbose: true,
  errorOnDeprecated: true,
  roots: [
    '<rootDir>/src',
    '<rootDir>/__test__',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleNameMapper,
  globals: {
    'ts-jest': {
      'tsconfig': '<rootDir>/tsconfig.json'
    }
  },
  setupFilesAfterEnv: [
    '<rootDir>/../../jest.setupEnzyme.ts',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '/(__test__)/[^/]+\\.spec\\.tsx?$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/lib/',
    '/dist/',
    '/build/',
    '/target/',
    '/vendor/',
    '/release/',
    '/example/',
    '/demo/',
    '/doc/',
    '/tmp/',
    '/__tmp__/',
    '/script/'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx,ts,tsx}',
    '**/src/*.{js,jsx,ts,tsx}',
    '!**/src/styled-components.ts',
    '!**/src/**/*.no-cover.{ts,tsx,js,jsx}',
    '!**/__test__/cases/**',
    '!**/node_modules/**',
    '!**/lib/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/target/**',
    '!**/vendor/**',
    '!**/release/**',
    '!**/example/**',
    '!**/demo/**',
    '!**/doc/**',
    '!**/tmp/**',
    '!**/__tmp__/**',
    '!**/script/**',
    '!**/coverage/**'
  ],
  coverageThreshold: {
    'global': {
      'branches': 50,
      'functions': 85,
      'lines': 90,
      'statements': 90
    }
  },
  coverageReporters: [
    'text',
    'text-summary'
  ]
}
