import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { HeaderBackButton } from 'react-navigation-stack';
import io from 'socket.io-client/dist/socket.io';
import CollectionPreview from '../../components/CollectionPreview';

@inject('user')
@inject('room')
@inject('collection')
@observer
export default class RoomLobby extends Component {
  static navigationOptions = ({navigation}) => {
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

    this.socket = io(`http://127.0.0.1:5000`, {transports: ['websocket']})
    this._onBack = this._onBack.bind(this)
    this._onRoomConnect = this._onRoomConnect.bind(this)
    this._addUser = this._addUser.bind(this)
    this._removeUser = this._removeUser.bind(this)

    this.socket.on('new_join', this._addUser)

    this.socket.on('new_leave', this._removeUser)
  }

  // Alters state indicating user has connected
  _onRoomConnect() {
    this.setState({connected: true})
  }

  componentDidMount() {
    this.props.navigation.setParams({onBack: this._onBack})

    // this.socket = io('http://127.0.0.1:5000', {transports: ['websocket']})

    this.socket.on('connect', this._onRoomConnect)
    this.socket.emit('join', {room: this.props.room.currentRoom.data.code, user: this.props.user})
  }

  async componentWillUnmount() {
    this.socket.disconnect()

    await this.props.room.leaveRoom()
  }

  _onBack() {
    Alert.alert(
      'Tem certeza que deseja sair desta sala?',
      null,
      [
        {text: 'Sair', style: 'destructive', onPress: () => {
          this.socket.emit('leave', {room: this.props.room.currentRoom.data.code, user: this.props.user})
          this.props.navigation.navigate('Home')
        }},
        {text: 'Continuar'}
      ]
    )
  }

  _addUser(data) {
    let new_user = data.user

    if(new_user.username == this.props.user.username) {
      return
    }

    console.log(new_user)

    this.props.room.currentRoom.users.push(new_user)
  }

  _removeUser(data) {
    let removed_user = data.user

    console.log(removed_user)

    this.props.room.currentRoom.users = this.props.room.currentRoom.users.filter(user => {
      return user.username != removed_user.username
    })
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
          <Text style={{color: '#000', textAlign: 'center'}}>{user.username}</Text>
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
      </View>
      ) :
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size='large' color='#FFF'/>
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
  }
})
