module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    '\\.(css|scss|png|svg)$': '<rootDir>/spec/__mocks__/fileMock.ts',
  },
  setupFiles: [
    './config/jest/setupEnzyme.ts',
  ]
};