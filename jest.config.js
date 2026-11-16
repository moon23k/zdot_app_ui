module.exports = {
  preset: '@react-native/jest-preset',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  resolver: '<rootDir>/jest/resolver.js',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 15000,
  modulePathIgnorePatterns: ['<rootDir>/packages/.*/lib/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-(svg|reanimated|worklets|gesture-handler|sortables))/)',
  ],
  moduleNameMapper: {
    '^react-native-reanimated$': 'react-native-reanimated/mock',
    '^react-native-worklets$': 'react-native-worklets/src/mock',
    '^react-native-sortables$': '<rootDir>/jest/react-native-sortables.js',
    '^@ezpg/app-ui$': '<rootDir>/packages/app-ui/src/index',
    '^@ezpg/app-ui/(adjust|charts|sortable)$':
      '<rootDir>/packages/app-ui/src/$1',
  },
};
