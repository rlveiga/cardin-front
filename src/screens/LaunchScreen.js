import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { AccessToken } from 'react-native-fbsdk';
import { inject, observer } from 'mobx-react';

@inject('user')
@observer
export default class LaunchScreen extends Component {
  componentDidMount() {
    this.getAccessToken()
  }

  async getAccessToken() {
    const data = await AccessToken.getCurrentAccessToken()

    console.log(data)

    // Has access token, login user
    if (data) {
      await this.props.user.login(
        data['accessToken']
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
