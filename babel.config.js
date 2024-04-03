const presets = ['module:@react-native/babel-preset']
const reanimated = ['react-native-reanimated/plugin']
const babelDecorator = ['@babel/plugin-proposal-decorators', { legacy: true }]
const plugins = [babelDecorator, reanimated]

module.exports = {
  presets,
  plugins,
}
