// from: https://levelup.gitconnected.com/how-to-add-a-custom-eslint-configuration-to-a-create-react-app-project-aea3f7c1d7af

module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  extends: ["react-app", "react-app/jest"],
  // parser: "babel-eslint", // Uses babel-eslint transforms.
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  // plugins: [],
  // root: true, // For configuration cascading.
  rules: {
    "require-await": "warn",
  },
  settings: {
    react: {
      version: "detect", // Detect react version
    },
  },
};
