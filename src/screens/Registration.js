import React, { Component } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { inject, observer } from 'mobx-react'

@inject('user')
@observer
export default class Registration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      passwordConfirm: ''
    }
  }

  async register() {
    await this.props.user.register(
      this.state.username,
      this.state.password
    )

    if(this.props.user.success) {
      await this.props.user.login(
        this.state.username,
        this.state.password
      )

      if(this.props.user.success) {
        this.props.navigation.navigate('Home')
      }

      else {
        Alert.alert(
          'Houve um erro no login',
          'Por favor, tente logar novamente',
          [
            {text: 'Ok', onPress: () => this.props.navigation.navigate('Login')}
          ]
        )
      }
    }

    else {
      Alert.alert(
        this.props.user.errorMsg,
        'Por favor, tente novamente'
      )
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='never'
        extraScrollHeight={heightPercentageToDP("7%")}
        bounces={false}
        contentContainerStyle={styles.container}>
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
          style={[styles.textInputContainer, { marginBottom: 42 }]}
          placeholder='Senha'
          placeholderTextColor='#A2A2A2'
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.password}
          onChangeText={(val) => this.setState({ password: val })} />

        <TextInput
          secureTextEntry={true}
          style={[styles.textInputContainer, { marginBottom: 64 }]}
          placeholder='Senha'
          placeholderTextColor='#A2A2A2'
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.passwordConfirm}
          onChangeText={(val) => this.setState({ passwordConfirm: val })} />

        <TouchableOpacity
          onPress={() => this.register()}
          style={styles.button}>
          <Text style={{ color: '#000' }}>Confirmar</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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