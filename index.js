/**
 * @format
 */

import 'react-native-get-random-values'
import {AppRegistry} from 'react-native'
import {name} from './app.json'
import App from './src/app'
import './src/localization/i18n'

AppRegistry.registerComponent(name, () => App)
