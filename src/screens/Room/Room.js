import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { HeaderBackButton } from 'react-navigation-stack';
import io from 'socket.io-client/dist/socket.io';
import CollectionPreview from '../../components/CollectionPreview';
import CardPreview from '../../components/CardPreview';
import Game from './Game';
import PlayersList from '../../components/PlayersList';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-easy-toast';

@inject('user')
@inject('room')
@inject('collection')
@observer
export default class Room extends Component {
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
      connected: false,
      gameStarted: false,
      maxPoints: 5
    }

    this.game = null
    this.toast = null

    this.socket = this.socket = io(`https://cardin-app.herokuapp.com`, { transports: ['websocket'] })

    this.socket.on('connect', this._onRoomConnect)
    this.socket.on('join_response', this._onUserAdded)
    this.socket.on('leave_response', this._onUserRemoved)
    this.socket.on('start_response', this._onGameStarted)
    this.socket.on('cards_selected_response', this._onCardsSelected)
    this.socket.on('pick_winner_response', this._onWinnerSelected)
    this.socket.on('new_round_start_response', this._onNewRoundStart)
    this.socket.on('card_swipe_response', this._onCardSwiped)
    this.socket.on('discard_option_response', this._onCardDiscarded)

    this._onBack = this._onBack.bind(this)
  }

  async componentDidMount() {
    this.props.navigation.setParams({ onBack: this._onBack, code: this.props.room.currentRoom.code })
  }

  async leaveRoom() {
    await this.props.room.leaveRoom()

    this.socket.emit('leave', { room: this.props.room.currentRoom.code, user: { username: this.props.user.username } })
    this.socket.disconnect()

    this.currentRoom = null
    this.props.navigation.navigate('Home')
  }

  _onRoomConnect = () => {
    // Alter state indicating user has connected
    this.setState({ connected: true })

    // Emit event to other users that may be in the room`
    this.socket.emit('join', { room: this.props.room.currentRoom.code, user: { username: this.props.user.username } })
  }

  _onUserAdded = (data) => {
    console.log(data)
    this.props.room.currentRoom.users = data.users
  }

  _onUserRemoved = (data) => {
    console.log(data)
    this.props.room.currentRoom.users = data.users
    this.props.room.currentRoom.game = data.game
  }

  _onGameStarted = (data) => {
    if (data['error']) {
      Alert.alert(
        data['error']
      )

      return
    }

    console.log(data)
    this.updateGame(data)

    this.props.room.userData = this.props.room.currentRoom.game.players.filter(player => {
      return player.data.id == this.props.user.id
    })

    this.setState({ gameStarted: true })
  }

  _onCardsSelected = (data) => {
    console.log(data)

    this.updateGame(data)
  }

  _onWinnerSelected = (data) => {
    console.log(data)

    this.updateGame(data)
  }

  _onNewRoundStart = (data) => {
    console.log(data)

    this.updateGame(data)

    this.props.room.userData = this.props.room.currentRoom.game.players.filter(player => {
      return player.data.id == this.props.user.id
    })
  }

  _onVoterSwiped = (index) => {
    console.log(index)

    this.socket.emit('card_swipe', { room: this.props.room.currentRoom.code, index: index })
  }

  _onCardSwiped = (index) => {
    console.log(index)

    console.log(this.state.game)

    if (this.game) {
      this.game._updateSwiperIndex(index)
    }
  }

  _onCardDiscarded = (data) => {
    console.log(data)

    this.updateGame(data)
  }

  updateGame(data) {
    this.props.room.currentRoom.game = data
    console.log('Game updated')
  }

  _onBack = () => {
    Alert.alert(
      'Tem certeza que deseja sair desta sala?',
      null,
      [
        {
          text: 'Sair', style: 'destructive', onPress: () => this.leaveRoom()
        },
        { text: 'Continuar' }
      ]
    )
  }

  async acquireCollection() {
    await this.props.collection.acquireCollection(
      this.props.room.currentRoom.collection.id
    )

    if (this.props.collection.success) {
      this.toast.show('Adicionado às suas coleções!')
    }

    else {
      this.toast.show(this.props.collection.errorMsg)
    }
  }

  async startGame() {
    this.socket.emit(
      'game_start',
      {
        room: this.props.room.currentRoom.code,
        collection: this.props.room.selectedCollection,
        max_points: this.state.maxPoints
      }
    )
  }

  renderGameLobby() {
    return (
      <View style={styles.container}>
        <View
          style={{ alignItems: "center", marginBottom: 32 }}>
          <CollectionPreview
            fontSize={heightPercentageToDP(4)}
            cardCountFontSize={heightPercentageToDP(3)}
            height={widthPercentageToDP(90)}
            width={widthPercentageToDP(55)}
            collection={this.props.room.currentRoom.collection}
          />
        </View>

        {
          this.props.room.currentRoom.created_by == this.props.user.id ?
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 18 }}>
                Melhor de {this.state.maxPoints} pontos
              </Text>

              <Slider
                style={{ width: widthPercentageToDP(60) }}
                value={this.state.maxPoints}
                onValueChange={val => this.setState({ maxPoints: val })}
                minimumValue={3}
                maximumValue={20}
                step={1} />

              <TouchableOpacity
                style={styles.startGameButton}
                onPress={() => this.startGame()}>
                <Text style={{ color: '#000', textAlign: 'center' }}>Começar partida</Text>
              </TouchableOpacity>
            </View> :
            <TouchableOpacity
              onPress={() => this.acquireCollection()}
              style={styles.startGameButton}>
              <Text style={{ color: '#000', textAlign: 'center' }}>Adquirir coleção</Text>
            </TouchableOpacity>
        }
      </View>
    )
  }

  render() {
    return (
      <View
        style={styles.container}>
        <PlayersList />
        {
          this.props.room.currentRoom.game && this.state.gameStarted ?
            <Game
              ref={ref => this.game = ref}
              socket={this.socket}
              onVoterSwiped={this._onVoterSwiped} /> :
            this.renderGameLobby()
        }

        <Toast
          position='bottom'
          positionValue={heightPercentageToDP(25)}
          fadeInDuration={150}
          fadeOutDuration={500}
          style={styles.toast}
          ref={ref => this.toast = ref} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000'
  },

  startGameButton: {
    alignSelf: 'center',
    backgroundColor: '#A2A2A2',
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4
  },

  toast: {
    paddingHorizontal: widthPercentageToDP(3),
    paddingVertical: widthPercentageToDP(1),
    backgroundColor: '#010054'
  }
})
