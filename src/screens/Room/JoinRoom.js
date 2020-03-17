import React, { Component } from 'react'
import { Alert, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { inject, observer } from 'mobx-react'

@inject('room')
@observer
export default class JoinRoom extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roomCode: ''
    }
  }

  async onButtonPress() {
    await this.props.room.joinRoom(this.state.roomCode)

    if(this.props.room.success) {
      // Go to room lobby
      this.props.navigation.navigate('Room', {code: this.props.room.currentRoom.data.code})
    }

    else {
      Alert.alert(
        'Erro ao entrar na sala',
        'Tente novamente mais tarde!',
        [{text: 'Entendi'}]
      )
    }
  }

  render() {
    return (
      <View
        style={styles.container}>
        <TextInput
          onChangeText={roomCode => this.setState({roomCode})}
          autoCapitalize='characters'
          autoCorrect={false}
          maxLength={5}
          style={styles.roomInput}
          placeholder='digite o nome da sala'
          placeholderTextColor='#A2A2A2'/>

        <TouchableOpacity
          style={{marginTop: 32}}
          onPress={() => this.onButtonPress()}>
          <Text style={{color: '#FFF', textAlign: 'center'}}>Entrar</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 25
  },
  
  roomInput: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#A2A2A2',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 24
  }
})