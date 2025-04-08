module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  testMatch: ["**/__tests__/**/*.(test).[jt]s?(x)"],
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    ".scannerwork/",
    ".env",
    "/dist"
],
};