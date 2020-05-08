/* eslint-disable no-console */

import Reactotron from 'reactotron-react-native';
import { AsyncStorage } from 'react-native';

declare global {
  interface Console {
    tron: any;
  }
}
const tron = Reactotron.useReactNative().connect();

tron.clear!();

console.tron = tron;
