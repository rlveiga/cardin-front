import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import AsyncLoader from '../components/AsyncLoader';

@inject('user')
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loading: false
    }
  }

  async login(username, password) {
    this.setState({ loading: true })

    await this.props.user.login(
      username,
      password
    )

    if (this.props.user.success) {
      this.setState({ loading: false })

      this.props.navigation.navigate('Home')
    }

    else {
      Alert.alert(
        this.props.user.errorMsg,
        null,
        [
          { text: 'Ok', onPress: () => this.setState({ loading: false }) }
        ]
      )
    }
  }

  async fbLogin(token) {
    this.setState({ loading: true })

    await this.props.user.fbLogin(
      token
    );

    if (this.props.user.success) {
      this.props.navigation.navigate('Home')
    }

    this.setState({ loading: false })
  }

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='never'
        bounces={false}
        contentContainerStyle={styles.container}>
        <Text
          style={styles.title}>
          Cardin
        </Text>

        <TextInput
          style={[styles.textInputContainer, { marginBottom: 42 }]}
          placeholder='Nome de usuário'
          placeholderTextColor='#A2A2A2'
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.username}
          onChangeText={(val) => this.setState({ username: val })} />
        <TextInput
          secureTextEntry={true}
          style={[styles.textInputContainer, { marginBottom: 64 }]}
          placeholder='Senha'
          placeholderTextColor='#A2A2A2'
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.password}
          onChangeText={(val) => this.setState({ password: val })} />

        <TouchableOpacity
          onPress={() => this.login(this.state.username, this.state.password)}
          style={styles.button}>
          <Text style={{ color: '#000' }}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Registration')}
          style={[styles.button, { backgroundColor: '#000', marginTop: heightPercentageToDP(2) }]}>
          <Text style={{ color: '#FFF' }}>Criar conta</Text>
        </TouchableOpacity>

        <View
          style={{ marginTop: heightPercentageToDP(5) }}>
          <LoginButton
            permissions={['public_profile']}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.log("login has error: " + result.error);
                } else if (result.isCancelled) {
                  console.log("login is cancelled.");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      this.fbLogin(data.accessToken.toString())
                    }
                  )
                }
              }
            }
            onLogoutFinished={() => console.log("logout.")} />
        </View>

        <AsyncLoader
          active={this.state.loading} />
      </KeyboardAwareScrollView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
  },

  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: heightPercentageToDP("8%")
  },

  textInputContainer: {
    alignSelf: 'stretch',
    color: '#FFF',
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 25,
    fontSize: 18,
  },

  button: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
})