import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { HeaderBackButton } from 'react-navigation-stack';
import io from 'socket.io-client/dist/socket.io';
import CollectionPreview from '../../components/CollectionPreview';

@inject('user')
@inject('room')
@inject('collection')
@observer
export default class RoomLobby extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    return {
      headerLeft: (
        <HeaderBackButton
          tintColor='#FFF'
          onPress={() => params.onBack()}
        />
      ),
      title: params.code
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      connected: true
    }

    this.socket = this.socket = io(`http://127.0.0.1:5000`, { transports: ['websocket'] })

    this.socket.on('connect', this._onRoomConnect)
    this.socket.on('join_response', this._addUser)
    this.socket.on('leave_response', this._removeUser)

    this._onBack = this._onBack.bind(this)
  }

  async componentDidMount() {
    this.props.navigation.setParams({ onBack: this._onBack })
  }

  async componentWillUnmount() {
    this.socket.disconnect()

    await this.props.room.leaveRoom()
  }

  _onRoomConnect = () => {
    // Alter state indicating user has connected
    this.setState({ connected: true })

    // Emit event to other users that may be in the room`
    this.socket.emit('join', { room: this.props.room.currentRoom.data.code, user: this.props.user })
  }

  _addUser = (data) => {
    console.log(data)
    let new_user = data.user

    if (new_user.username == this.props.user.username) {
      return
    }

    console.log(new_user)

    this.props.room.currentRoom.users.push(new_user)
  }

  _removeUser = (data) => {
    console.log(data)
    let removed_user = data.user

    console.log(removed_user)

    this.props.room.currentRoom.users = this.props.room.currentRoom.users.filter(user => {
      return user.username != removed_user.username
    })
  }

  _onBack = () => {
    Alert.alert(
      'Tem certeza que deseja sair desta sala?',
      null,
      [
        {
          text: 'Sair', style: 'destructive', onPress: () => {
            this.socket.emit('leave', { room: this.props.room.currentRoom.data.code, user: this.props.user })
            this.props.navigation.navigate('Home')
          }
        },
        { text: 'Continuar' }
      ]
    )
  }

  renderUsers() {
    return this.props.room.currentRoom.users.map((user, i) => {
      return (
        <View
          key={i}
          style={{
            backgroundColor: '#FFF',
            height: heightPercentageToDP("8%"),
            width: heightPercentageToDP("8%"),
            borderRadius: heightPercentageToDP("4%"),
            justifyContent: 'center',
            marginHorizontal: 6
          }}>
          <Text style={{ color: '#000', textAlign: 'center' }}>{user.username}</Text>
        </View>
      )
    })
  }

  render() {
    return (
      this.state.connected ? (
        <View style={styles.container}>
          <View style={styles.userList}>
            {this.renderUsers()}
          </View>

          <CollectionPreview
            collection={this.props.room.currentRoom.game.collection}
          />

          {
            this.props.room.currentRoom.data.created_by == this.props.user.id ?
              <TouchableOpacity
                style={styles.startGameButton}
                onPress={() => this.socket.emit('game_start', `${this.props.user.username} começou a partida`)}>
                <Text style={{ color: '#000', textAlign: 'center' }}>Começar partida</Text>
              </TouchableOpacity> :
              null
          }
        </View>
      ) :
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' color='#FFF' />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },

  userList: {
    flexDirection: 'row',
    alignItems: 'center',
    height: heightPercentageToDP("10%"),
    paddingHorizontal: 12
  },

  startGameButton: {
    position: 'absolute',
    bottom: heightPercentageToDP(2),
    alignSelf: 'center',
    backgroundColor: '#A2A2A2',
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4
  }
})
