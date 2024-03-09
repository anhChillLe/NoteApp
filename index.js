import { AppRegistry } from 'react-native'
import 'react-native-get-random-values'
import { name as appName } from './app.json'
import App from './src/app'

AppRegistry.registerComponent(appName, () => App)