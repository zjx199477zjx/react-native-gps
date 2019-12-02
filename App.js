import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  BackAndroid,
  WebView,
  YellowBox
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import RouteConfig from './app/RouteConfig';
import StackNavigatorConfig from './app/StackNavigatorConfig';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
const Navigator = StackNavigator(RouteConfig,StackNavigatorConfig.StackNavigatorConfig);

export default class App extends PureComponent {

  render() {
    return (
        < Navigator />
    );
  }
}

