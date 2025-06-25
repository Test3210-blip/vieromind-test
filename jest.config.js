module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^state/(.*)$': '<rootDir>/state/$1',
    '^components/(.*)$': '<rootDir>/components/$1',
    '^types/(.*)$': '<rootDir>/types/$1',
    '^utils/(.*)$': '<rootDir>/utils/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/components/journals/Journals.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react|@testing-library|@heroicons|jotai|next-auth|react-hot-toast)/)',
  ],
};
