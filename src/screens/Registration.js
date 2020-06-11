import React, { Component } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { inject, observer } from 'mobx-react'
import DefaultButton from '../components/DefaultButton'
import ErrorText from '../components/ErrorText'
import AsyncLoader from '../components/AsyncLoader';

@inject('user')
@observer
export default class Registration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      selectedColor: '#000000',
      hasErrorPassword: false,
      errorMsgPassword: '',
      loading: false
    }
  }

  isButtonDisabled() {
    if (
      this.state.username == '' ||
      this.state.password.length == 0 ||
      this.state.passwordConfirm.length == 0 ||
      this.state.hasErrorPassword
    ) {
      return true
    }

    return false
  }

  async register() {
    this.setState({ loading: true })

    await this.props.user.register(
      this.state.username,
      this.state.password,
      this.state.selectedColor
    )

    if (this.props.user.success) {
      await this.props.user.login(
        this.state.username,
        this.state.password
      )

      if (this.props.user.success) {
        this.setState({ loading: false })
        this.props.navigation.navigate('Home')
      }

      else {
        Alert.alert(
          'Houve um erro no login',
          'Por favor, tente logar novamente',
          [
            {
              text: 'Ok', onPress: () => {
                this.setState({ loading: false })
                this.props.navigation.navigate('Login')
              }
            }
          ]
        )
      }
    }

    else {
      Alert.alert(
        this.props.user.errorMsg,
        'Por favor, tente novamente',
        [
          {
            text: 'Ok', onPress: () => this.setState({ loading: false })
          }
        ]
      )
    }
  }

  updateUsername(username) {
    if (this.isUsernameValid(username) || username.length == 0) {
      this.setState({ username })
    }
  }

  isUsernameValid(username) {
    var re = /^\w+$/;
    if (!re.test(username)) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='never'
          extraScrollHeight={heightPercentageToDP("7%")}
          bounces={false}
          contentContainerStyle={styles.container}>
          <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', paddingTop: 25 }}>
            <View
              style={styles.profilePreviewContainer}>
              <View
                style={[styles.profilePreview, { backgroundColor: this.state.selectedColor }]}>
                <Text
                  style={styles.profilePreviewText}>
                  {this.state.username ? this.state.username[0].toUpperCase() : null}
                </Text>
              </View>

              <View
                style={styles.colorsContainer}>
                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#348082' })}
                  style={[styles.colorPreview, { backgroundColor: '#348082' }]} />

                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#000000' })}
                  style={[styles.colorPreview, { backgroundColor: '#000000' }]} />

                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#400807' })}
                  style={[styles.colorPreview, { backgroundColor: '#400807' }]} />

                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#801A17' })}
                  style={[styles.colorPreview, { backgroundColor: '#801A17' }]} />
              </View>

              <View
                style={styles.colorsContainer}>
                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#932191' })}
                  style={[styles.colorPreview, { backgroundColor: '#932191' }]} />

                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#AD3D6F' })}
                  style={[styles.colorPreview, { backgroundColor: '#AD3D6F' }]} />

                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#C7594B' })}
                  style={[styles.colorPreview, { backgroundColor: '#C7594B' }]} />

                <TouchableOpacity
                  onPress={() => this.setState({ selectedColor: '#FF9300' })}
                  style={[styles.colorPreview, { backgroundColor: '#FF9300' }]} />
              </View>
            </View>

            <View
              style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', marginVertical: heightPercentageToDP(5) }}>
              <TextInput
                style={styles.textInputContainer}
                placeholder='Nome de usuário'
                placeholderTextColor='#A2A2A2'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.username}
                onChangeText={(val) => this.updateUsername(val)} />

              <TextInput
                secureTextEntry={true}
                style={[styles.textInputContainer, { marginTop: 32 }]}
                placeholder='Senha'
                placeholderTextColor='#A2A2A2'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.password}
                onChangeText={(val) => {
                  this.setState({ password: val })
                }} />

              <TextInput
                secureTextEntry={true}
                style={[styles.textInputContainer, { marginTop: 32, borderColor: this.state.hasErrorPassword ? 'red' : 'grey', }]}
                placeholder='Confirmar senha'
                placeholderTextColor='#A2A2A2'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.passwordConfirm}
                onChangeText={(val) => {
                  if (val != this.state.password) {
                    this.setState({ hasErrorPassword: true, errorMsgPassword: 'Senhas não conferem' })
                  }

                  else {
                    this.setState({ hasErrorPassword: false })
                  }

                  this.setState({ passwordConfirm: val })
                }} />

              <ErrorText
                textAlign='left'
                show={this.state.hasErrorPassword}
                text={this.state.errorMsgPassword} />

              <Text
                style={[styles.bottomInfoText, { marginTop: this.state.hasErrorPassword ? 32 - heightPercentageToDP(2) : 32 }]}>
                As cartas e coleções que você criar ficarão associadas a este usuário.
              </Text>
            </View>
          </View>

          <DefaultButton
            disabled={this.isButtonDisabled()}
            style={{ marginBottom: 32 }}
            onPress={() => this.register()}
            label='Confirmar' />
        </KeyboardAwareScrollView>

        <AsyncLoader
          active={this.state.loading} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
  },

  profilePreviewContainer: {
    alignItems: 'center',
    alignSelf: 'stretch'
  },

  profilePreview: {
    height: heightPercentageToDP(15),
    width: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(7.5),
    borderColor: '#FFF',
    borderWidth: 4,
    justifyContent: 'center',
    marginBottom: heightPercentageToDP(2)
  },

  profilePreviewText: {
    fontSize: 48,
    color: '#FFF',
    textAlign: 'center'
  },

  colorsContainer: {
    marginVertical: heightPercentageToDP(1),
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },

  colorPreview: {
    height: heightPercentageToDP(5),
    width: heightPercentageToDP(5),
    borderRadius: heightPercentageToDP(2.5),
    borderColor: '#FFF',
    borderWidth: 2,
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

  bottomInfoText: {
    color: '#E4E4E4',
    textAlign: 'left'
  },

  button: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
})