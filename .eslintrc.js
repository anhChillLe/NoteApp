module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['eslint-plugin-react-compiler'],
  rules: {
    semi: 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-shadow': ['off'],
    'react-native/no-inline-styles': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react-compiler/react-compiler': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
