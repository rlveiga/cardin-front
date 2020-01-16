import React, { Component } from 'react';

import {
  Login,
  Home
} from './src/screens'

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Provider } from 'mobx-react';
import stores from './src/stores';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Remote debugger']);

const LoggedOutNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  }
}, {
  initialRouteName: 'Login'
});

const HomeNavigator = createStackNavigator({
  Home: {
    screen: Home,
  }
}, {
  initialRouteName: 'Home'
});

const LoginNavigator = createSwitchNavigator({
  LoggedOutNavigator: {
    screen: LoggedOutNavigator
  },

  HomeNavigator: {
    screen: HomeNavigator
  }
}, {
  initialRouteName: 'LoggedOutNavigator'
});

const AppContainer = createAppContainer(LoginNavigator);

export default class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <AppContainer/>
      </Provider>
    );
  }
};