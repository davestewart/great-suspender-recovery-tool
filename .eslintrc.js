module.exports = {
  env: {
    webextensions: true,
    browser: true,
    es2021: true,
  },
  globals: {
    chrome: true,
    Vue: true,
  },
  extends: [
    'standard',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'brace-style': ['error', 'stroustrup'],
  },
}
