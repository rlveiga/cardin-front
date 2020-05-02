import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import { inject, observer } from 'mobx-react'

@inject('room')
@observer
export default class CreateRoom extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roomCode: ''
    }
  }

  async onButtonPress() {
    await this.props.room.createRoom(this.state.roomCode, this.props.room.selectedCollection.id)

    if(this.props.room.success) {
      this.props.navigation.navigate('Room')
    }

    else {
      Alert.alert(
        'Erro ao criar sala',
        'Tente novamente mais tarde!',
        [{text: 'Entendi'}]
      )
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
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
          <Text style={{color: '#FFF', textAlign: 'center'}}>Criar</Text>
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