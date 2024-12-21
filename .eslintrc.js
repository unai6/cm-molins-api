module.exports = {
  env: {
    commonjs: true,
    es6: true,
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Add here all the extra rules based on the developer preferences
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'comma-dangle': ['error', 'always-multiline'],
    'padded-blocks': ['warn', 'never', { allowSingleLineBlocks: true }],
  },
}
