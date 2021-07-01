module.exports = {
  setupFiles: ["<rootDir>/tests/dotenv-config.js"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.(ts|tsx)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  verbose: true,
}
