module.exports = {
  verbose: true,
  rootDir: __dirname,
  setupFilesAfterEnv: ["<rootDir>/src/app/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^app(.*)$": "<rootDir>/src/app$1",
    "^framework(.*)$": "<rootDir>/src/framework$1",
    "^domains(.*)$": "<rootDir>/src/domains$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  }
};
