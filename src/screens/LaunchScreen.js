import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native'
import { AccessToken } from 'react-native-fbsdk';
import { inject, observer } from 'mobx-react';

@inject('user')
@observer
export default class LaunchScreen extends Component {
  componentDidMount() {
    this.getLoginInfo()
  }

  async getLoginInfo() {
    let userSession = await AsyncStorage.getItem('credentials')
    
    console.log(userSession)

    // Has credentials, login user
    if (userSession) {
      userSession = JSON.parse(userSession)

      await this.props.user.login(
        userSession.username,
        userSession.password
      )

      if (this.props.user.success) {
        this.props.navigation.navigate('Home')
      }
    }

    else {
      this.props.navigation.navigate('Login')
    }
  }

  render() {
    return (
      <View
      style={styles.container}>
        <ActivityIndicator size='large' color='#FFF'/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000'
  }
})
