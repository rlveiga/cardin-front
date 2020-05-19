import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator, AsyncStorage, Platform } from 'react-native'
import { AccessToken } from 'react-native-fbsdk';
import { inject, observer } from 'mobx-react';
import codePush from 'react-native-code-push';
import { ENV } from 'react-native-dotenv';
@inject('user')
@observer
export default class LaunchScreen extends Component {
  componentDidMount() {
    this.checkForUpdates()
    this.getLoginInfo()
  }

  async checkForUpdates() {
    let codePushOptions = {
      installMode: codePush.InstallMode.ON_NEXT_RESUME
    }

    if(ENV == 'prod') {
      if(Platform.OS == 'ios') {
        codePushOptions.deploymentKey = 'NtJ1WgW_Hq640kb6SkXzwmsGW3oQ0ah_MFGfj'
      }

      else {
        codePushOptions.deploymentKey = '0kYS2fjliUno8AV3M4f9qDx8LzZTRfDnrtKVI'
      }
    }

    else {
      if(Platform.OS == 'ios') {
        codePushOptions.deploymentKey = 'KzGjiyv9cvIp-iNthVNnrvl1pFD1i_zPabSi4'
      }

      else {
        codePushOptions.deploymentKey = '4B1dFM4MTpP9vJE2mbe03kk_A3PfEKW28lssC'
      }
    }

    const hasUpdate = await codePush.checkForUpdate(codePushOptions.deploymentKey);

    console.log('Has CodePush update? ', hasUpdate)

    if(hasUpdate) {
      codePush.sync(
        codePushOptions
      )
    }
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

      else {
        this.props.navigation.navigate('Login')
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
