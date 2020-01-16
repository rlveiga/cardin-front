import React, { Component } from 'react';

import {
  Login,
  Home,
  CardsCollections,
  CreateCard
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
  },

  CardsCollections: {
    screen: CardsCollections,
    navigationOptions: {
      title: 'Cards and Collections'
    }
  },

  CreateCard: {
    screen: CreateCard,
    navigationOptions: {
      title: 'Create card'
    }
  }
}, {
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    headerTintColor: '#FFF',
    headerStyle: {
      backgroundColor: '#000',
      elevation: 0,
      borderBottomWidth: 0
    },
    headerBackTitle: null
  }
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