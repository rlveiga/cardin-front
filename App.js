import { Provider } from 'mobx-react';
import React, { Component } from 'react';
import { StatusBar, YellowBox, TouchableOpacity, Text, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Collections, CreateCard, CreateCollection, CreateRoom, Home, JoinRoom, LaunchScreen, Login, Room, SelectCollection, ShowCollection, Registration } from './src/screens';
import stores from './src/stores';

YellowBox.ignoreWarnings(['Remote debugger']);

const LoggedOutNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },

  Registration: {
    screen: Registration,
    navigationOptions: {
      title: 'Cadastro'
    }
  }
}, {
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#000',
      borderBottomWidth: 0,
      elevation: 0
    },
    headerTintColor: '#FFF',
    headerBackTitle: null
  }
});

const HomeNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },

  CreateRoom: {
    screen: CreateRoom,
    navigationOptions: {
      title: 'Criar sala',
    }
  },

  JoinRoom: {
    screen: JoinRoom,
    navigationOptions: {
      title: 'Buscar sala',
    }
  },

  SelectCollection: {
    screen: SelectCollection,
    navigationOptions: {
      title: 'Selecionar coleção'
    }
  },

  Room: {
    screen: Room,
    navigationOptions: {
      gesturesEnabled: false
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
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
    headerBackTitle: null
  }
});

HomeNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true

  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  }
}

const CollectionsNavigator = createStackNavigator({
  Collections: {
    screen: Collections,
    navigationOptions: ({ navigation }) => ({
      title: 'Coleções',
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginRight: 32 }}
            onPress={navigation.getParam('toggleEditCollections')}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
              {
                navigation.getParam('editModeOn') ?
                  'Concluir' :
                  'Editar'
              }
            </Text>
          </TouchableOpacity>
        )
      }
    })
  },

  CreateCard: {
    screen: CreateCard,
    navigationOptions: {
      title: 'Nova carta'
    }
  },

  CreateCollection: {
    screen: CreateCollection,
    navigationOptions: ({ navigation }) => ({
      title: 'Nova coleção',
      headerRight: () => {
        console.log(navigation)
        return (
          <TouchableOpacity
            style={{ marginRight: 32 }}
            onPress={navigation.getParam('createCollection')}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Criar</Text>
          </TouchableOpacity>
        )
      }
    })
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
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
    headerBackTitle: null
  }
})

CollectionsNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true

  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  }
}


const LoggedInTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeNavigator,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='home' width={23} height={23} color={tintColor} />
      ),
    }
  },

  Collections: {
    screen: CollectionsNavigator,
    navigationOptions: {
      tabBarLabel: 'Coleções',
      tabBarIcon: ({ tintColor }) => (
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
  LaunchScreen: {
    screen: LaunchScreen
  },

  LoggedOutNavigator: {
    screen: LoggedOutNavigator
  },

  HomeNavigator: {
    screen: LoggedInTabNavigator
  }
}, {
  initialRouteName: 'LaunchScreen'
});

const AppContainer = createAppContainer(LoginNavigator);

export default class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <StatusBar barStyle='light-content' />
        <AppContainer />
      </Provider>
    );
  }
};