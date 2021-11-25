/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Main from './Main';
import {name as appName} from './app.json';

import axios from 'axios';

//axios.defaults.baseURL = 'https://api.gotogetherapp.me/api/v1';
axios.defaults.baseURL = 'http://192.168.2.124:3000/api/v1';

AppRegistry.registerComponent(appName, () => Main);
