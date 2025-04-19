const ReactCompilerConfig = {
  target: '19',
}

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['babel-plugin-react-compiler', ReactCompilerConfig],
    [
      'module-resolver',
      {
        alias: {
          '^~/(.+)': './src/\\1',
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
}
