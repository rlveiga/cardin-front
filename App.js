import React, { Component } from 'react';

import {
  Login,
  Home,
  Cards,
  CreateCard,
  Collections,
  CreateCollection,
  ShowCollection
} from './src/screens'

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator, MaterialTopTabBar, createBottomTabNavigator } from 'react-navigation-tabs';
 
import { Provider } from 'mobx-react';
import stores from './src/stores';
import { View, StatusBar, YellowBox, Text, SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements'

YellowBox.ignoreWarnings(['Remote debugger']);

// function SafeAreaMaterialTopTabBar (props) {
//   return (
//     <View>
//       <SafeAreaView style={{backgroundColor: '#000'}}>
//         <MaterialTopTabBar
//         activeTintColor='#FFF'
//         inactiveTintColor='#FFF'
//         style={{backgroundColor: '#000'}}
//         {...props} />
//       </SafeAreaView>
//     </View>
//   )
// }

// const CardsCollectionsNavigator = createMaterialTopTabNavigator({
//   Cards: {
//     screen: Cards,
//     navigationOptions: {
//       title: 'Cards'
//     }
//   },

//   Collections: {
//     screen: Collections,
//     navigationOptions: {
//       title: 'Collections'
//     }
//   }
// }, {
//   initialRouteName: 'Cards',
//   tabBarComponent: SafeAreaMaterialTopTabBar,
//   navigationOptions: {
//     swipeEnabled: true
//   }
// })

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
    navigationOptions: {
      header: null
    }
  }
}, {
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    headerTintColor: '#FFF',
    headerTitleStyle: {
      fontSize: 28,
      fontWeight: 'bold'
    },
    headerStyle: {
      backgroundColor: '#000',
      elevation: 0,
      borderBottomWidth: 0,
      paddingBottom: 12,
    },
    headerBackTitle: null
  }
});

const CollectionsNavigator = createStackNavigator({
  Collections: {
    screen: Collections,
    navigationOptions: {
      title: 'Collections'
    }
  },

  CreateCard: {
    screen: CreateCard,
    navigationOptions: {
      title: 'New card'
    }
  },

  CreateCollection: {
    screen: CreateCollection,
    navigationOptions: {
      title: 'New collection'
    }
  },

  ShowCollection: {
    screen: ShowCollection
  }
}, {
  initialRouteName: 'Collections',
  defaultNavigationOptions: {
    headerTintColor: '#FFF',
    headerTitleStyle: {
      fontSize: 28,
      fontWeight: 'bold'
    },
    headerStyle: {
      backgroundColor: '#000',
      elevation: 0,
      borderBottomWidth: 0,
      paddingBottom: 12,
    },
    headerBackTitle: null
  }
})

const LoggedInTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeNavigator,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({tintColor}) => (
        <Icon name='home' width={23} height={23} color={tintColor} />
      ),
    }
  },

  Collections: {
    screen: CollectionsNavigator,
    navigationOptions: {
      tabBarLabel: 'Coleções',
      tabBarIcon: ({tintColor}) => (
        <Icon name='collections-bookmark' width={23} height={23} color={tintColor} />
      ),
    }
  }
}, {
  initialRouteName: 'Home',
  tabBarOptions: {
    labelStyle: {
      color: '#000'
    },
    tabStyle: {
      backgroundColor: '#FFF'
    },
    activeTintColor: 'rgba(0, 0, 0, 1)',
    inactiveTintColor: 'rgba(0, 0, 0, 0.5)'
  }
})

const LoginNavigator = createSwitchNavigator({
  LoggedOutNavigator: {
    screen: LoggedOutNavigator
  },

  HomeNavigator: {
    screen: LoggedInTabNavigator
  }
}, {
  initialRouteName: 'LoggedOutNavigator'
});

const AppContainer = createAppContainer(LoginNavigator);

export default class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <StatusBar barStyle='light-content'/>
        <AppContainer/>
      </Provider>
    );
  }
};