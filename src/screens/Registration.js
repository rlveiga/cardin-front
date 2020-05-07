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
      passwordConfirm: '',
      selectedColor: '#000000'
    }
  }

  async register() {
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
        this.props.navigation.navigate('Home')
      }

      else {
        Alert.alert(
          'Houve um erro no login',
          'Por favor, tente logar novamente',
          [
            { text: 'Ok', onPress: () => this.props.navigation.navigate('Login') }
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
      <View style={{flex: 1, backgroundColor: '#000'}}>
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
                onPress={() => this.setState({ selectedColor: '#000000' })}
                style={[styles.colorPreview, { backgroundColor: '#000000' }]} />

              <TouchableOpacity
                onPress={() => this.setState({ selectedColor: '#b04632' })}
                style={[styles.colorPreview, { backgroundColor: '#b04632' }]} />

              <TouchableOpacity
                onPress={() => this.setState({ selectedColor: '#2156cf' })}
                style={[styles.colorPreview, { backgroundColor: '#2156cf' }]} />

              <TouchableOpacity
                onPress={() => this.setState({ selectedColor: '#ff1ea5' })}
                style={[styles.colorPreview, { backgroundColor: '#ff1ea5' }]} />
            </View>
          </View>

          <View
          style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center'}}>
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
              placeholder='Confirmar senha'
              placeholderTextColor='#A2A2A2'
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.passwordConfirm}
              onChangeText={(val) => this.setState({ passwordConfirm: val })} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => this.register()}
          style={styles.button}>
          <Text style={{ color: '#000' }}>Confirmar</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
    justifyContent: 'center'
  },

  profilePreviewText: {
    fontSize: 48,
    color: '#FFF',
    textAlign: 'center'
  },

  colorsContainer: {
    marginVertical: heightPercentageToDP(3),
    flexDirection: 'row',
  },

  colorPreview: {
    height: heightPercentageToDP(5),
    width: heightPercentageToDP(5),
    borderRadius: heightPercentageToDP(2.5),
    borderColor: '#FFF',
    borderWidth: 2,
    marginHorizontal: widthPercentageToDP(5)
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
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
})