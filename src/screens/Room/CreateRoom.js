import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import { inject, observer } from 'mobx-react'
import AsyncLoader from '../../components/AsyncLoader'

@inject('room')
@observer
export default class CreateRoom extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roomCode: '',
      loading: false
    }
  }

  async onButtonPress() {
    this.setState({ loading: true })

    await this.props.room.createRoom(this.state.roomCode, this.props.room.selectedCollection.id)

    if (this.props.room.success) {
      this.setState({ loading: false })
      this.props.navigation.navigate('Room')
    }

    else {
      Alert.alert(
        'Erro ao criar sala',
        'Tente novamente mais tarde!',
        [{ text: 'Entendi', onPress: () => this.setState({ loading: false }) }]
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={roomCode => this.setState({ roomCode })}
          autoCapitalize='characters'
          autoCorrect={false}
          maxLength={5}
          style={styles.roomInput}
          placeholder='digite o nome da sala'
          placeholderTextColor='#A2A2A2' />

        <TouchableOpacity
          style={{ marginTop: 32 }}
          onPress={() => this.onButtonPress()}>
          <Text style={{ color: '#FFF', textAlign: 'center' }}>Criar</Text>
        </TouchableOpacity>

        <AsyncLoader
          active={this.state.loading} />
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