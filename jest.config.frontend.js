module.exports = {
  rootDir: __dirname,
  setupFilesAfterEnv: ["<rootDir>/src/app/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "^app(.*)$": "<rootDir>/src/app$1",
    "^framework(.*)$": "<rootDir>/src/framework$1",
    "^domains(.*)$": "<rootDir>/src/domains$1"
  },
  // 2x faster test.
  testEnvironment: "node",
  snapshotSerializers: ["enzyme-to-json/serializer"]
};
