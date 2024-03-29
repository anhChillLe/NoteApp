module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  rules: {
    semi: 0,
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-shadow': ['off'],
    'react-native/no-inline-styles': 'warn',
  },
}
