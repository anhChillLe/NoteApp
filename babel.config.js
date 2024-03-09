const presets = ['module:@react-native/babel-preset']
const reanimated = ['react-native-reanimated/plugin']
const babelDecorator = ["@babel/plugin-proposal-decorators", { legacy: true }]
const plugins = [reanimated, babelDecorator]

module.exports = {
  presets,
  plugins,
}
