import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CardPreview from '../../components/CardPreview';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import PlayersList from '../../components/PlayersList';
import io from 'socket.io-client/dist/socket.io';
import Swiper from 'react-native-swiper';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import PlayerPreview from '../../components/PlayerPreview';

@inject('user')
@inject('room')
@observer
export default class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      handLoaded: false,
      hand: null,
      cardsSelectedCount: 0,
      cardsSelected: [],
      swiperIndex: 0
    }

    this.voterSwiper = null
    this.spectatorSwiper = null
  }

  renderHandCards() {
    if (this.props.room.userData) {
      return this.props.room.currentRoom.game.players.filter(player => {
        return player.data.id == this.props.user.id
      })[0].hand.map((card, i) => {
        return (
          <View
            key={i}
            style={{ alignItems: 'center' }}>
            {
              card['selected'] ?
                <Text style={{ color: '#FFF', position: 'absolute', top: -heightPercentageToDP(2) }}>
                  {card['selectedIndex']}
                </Text> :
                null
            }
            <TouchableOpacity
              onPress={() => this.onCardSelect(card)}
              disabled={this.isCzar()}>
              <CardPreview
                disabled={this.isCzar() || card['selected']}
                style={{ marginBottom: 0 }}
                key={i}
                card={card} />
            </TouchableOpacity>
          </View>
        )
      })
    }

    else return null
  }

  onCardSelect(card) {
    card['selected'] = !card['selected']

    let copiedList = this.state.cardsSelected

    if (card['selected']) {
      const cardCopy = {
        id: card.id,
        card_type: card.card_type,
        name: card.name,
        created_by: card.created_by,
        slots: card.slots
      }

      copiedList.push(cardCopy)
      card['selectedIndex'] = copiedList.length
    }

    else {
      copiedList = copiedList.filter((elem) => {
        return elem.id != card.id
      })
    }

    this.setState({ cardsSelected: copiedList })
  }

  confirmSelectedCards() {
    this.props.socket.emit('cards_selected', {
      room: this.props.room.currentRoom.code,
      user_id: this.props.user.id,
      cards: this.state.cardsSelected
    })

    this.setState({ cardsSelected: [], cardsSelectedCount: 0 })
  }

  confirmWinner(winner_id) {
    console.log(winner_id)

    this.props.socket.emit('pick_winner', {
      room: this.props.room.currentRoom.code,
      winner_id: winner_id
    })
  }

  discardOption(user_id) {
    console.log(user_id)
    this.props.socket.emit('discard_option', {
      room: this.props.room.currentRoom.code,
      user_id: user_id
    })
  }

  isCzar() {
    return this.props.room.currentRoom.game.czar_id == this.props.user.id
  }

  renderSelecting() {
    return this.props.room.currentRoom.game ?
      <View
        style={styles.container}>
        <View
          style={{
            paddingVertical: heightPercentageToDP(2),
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center'
          }}>

          {
            this.isCzar() ?
              <Text
                style={styles.czarInfoText}>
                Você é o votador!
                </Text> :
              null
          }

          <CardPreview
            fontSize={heightPercentageToDP(3)}
            height={widthPercentageToDP(80)}
            width={widthPercentageToDP(50)}
            card={this.props.room.currentRoom.game.table_card} />

          {
            !this.isCzar() ?
              <TouchableOpacity
                onPress={() => this.confirmSelectedCards()}>
                <Text style={{ color: '#FFF' }}>Jogar</Text>
              </TouchableOpacity> :
              null
          }
        </View>

        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.handContainer}>
          {this.renderHandCards()}
        </ScrollView>
      </View> :
      null
  }

  renderCard = ({ item, index }) => {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{ opacity: item.discarded ? 0.4 : 1, alignSelf: 'center' }}>
          {
            item.cards.length == 1 ?
              <CardPreview
                fontSize={widthPercentageToDP(7)}
                width={widthPercentageToDP(60)}
                height={widthPercentageToDP(85)}
                card={item.cards[0]} /> :
              item.cards.map((card, i) => {
                return (
                  <View
                    style={{ alignItems: 'center' }}>
                    <CardPreview
                      style={{
                        top: i % 2 == 0 ? heightPercentageToDP(30) : 0,
                        shadowOpacity: 0.8,
                        elevation: 2,
                        shadowRadius: heightPercentageToDP(5),
                        shadowOffset: { width: 0, height: heightPercentageToDP(5) }
                      }}
                      fontSize={widthPercentageToDP(7)}
                      width={i % 2 == 0 ? widthPercentageToDP(60) : widthPercentageToDP(65)}
                      height={heightPercentageToDP(50)}
                      card={card} />
                  </View>
                )
              })
          }
        </View>

        {
          this.props.room.currentRoom.game.czar_id == this.props.user.id ?
            <View
              style={[styles.voteButtonsContainer, { bottom: item.cards.length == 1 ? heightPercentageToDP(15) : heightPercentageToDP(2) }]}>
              <TouchableOpacity
                disabled={item.discarded}
                onPress={() => this.confirmWinner(item.user.id)}
                style={[styles.voteButton, { backgroundColor: 'green' }]}>
                <Icon name='check' color='#FFF' size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={item.discarded}
                onPress={() => this.discardOption(item.user.id)}
                style={[styles.voteButton, { backgroundColor: 'red' }]}>
                <Icon name='trash' color='#FFF' size={24} />
              </TouchableOpacity>
            </View> :
            null
        }
      </View>
    )
  }

  renderVoting() {
    return this.props.room.currentRoom.game.czar_id == this.props.user.id ?
      <View
        style={styles.container}>
        <View
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            paddingHorizontal: 25
          }}>
          <Text style={{
            textAlign: "left",
            color: '#FFF',
            fontSize: heightPercentageToDP(4)
          }}>
            {this.props.room.currentRoom.game.table_card.name}
          </Text>
        </View>

        <View
          style={{ flex: 1 }}>
          <Carousel
            onSnapToItem={this._onVotersSwipe}
            onScrollAnimationEnd={this._onVotersSwipe}
            data={this.props.room.currentRoom.game.selected_cards}
            renderItem={this.renderCard}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(75)} />
        </View>

      </View> :
      <View
        style={styles.container}>
        <View
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            paddingHorizontal: 25
          }}>
          <Text style={{
            textAlign: "left",
            color: '#FFF',
            fontSize: heightPercentageToDP(4)
          }}>
            {this.props.room.currentRoom.game.table_card.name}
          </Text>
        </View>

        <View
          style={{ flex: 1 }}>
          <Carousel
            ref={ref => this.spectatorSwiper = ref}
            scrollEnabled={false}
            data={this.props.room.currentRoom.game.selected_cards}
            renderItem={this.renderCard}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(75)} />
        </View>
      </View>
  }

  _onVotersSwipe = (index) => {
    this.props.onVoterSwiped(index)
  }

  _updateSwiperIndex = (index) => {
    if (this.props.room.currentRoom.game.czar_id != this.props.user.id) {
      this.spectatorSwiper.snapToItem(index)
    }
  }

  renderResults() {
    const winner = this.props.room.currentRoom.game.round_winner

    return (
      <View
        style={styles.container}>
        <PlayerPreview
          player={winner} />

        <Text
          style={styles.winnerText}>
          {`${winner.source == 'fb' ? winner.name.split(' ')[0] : winner.username} venceu a rodada!`}
        </Text>

        <View style={styles.scoreboard}>
          {
            this.props.room.currentRoom.game.players
              .slice()
              .sort((a, b) => {
                return b.score - a.score
              })
              .map((player, i) => {
                return (
                  <View style={styles.scoreboardItem}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <PlayerPreview
                        fontSize={14}
                        height={heightPercentageToDP(4)}
                        width={heightPercentageToDP(4)}
                        player={player.data} />

                      <View
                        style={{ marginLeft: widthPercentageToDP(2), backgroundColor: '#FFF', justifyContent: 'center', flex: 1, borderRadius: widthPercentageToDP(5) }}>
                        <Text style={{ color: '#000', textAlign: 'center' }}>
                          {player.data.source == 'fb' ? player.data.name.split(' ')[0] : player.data.username}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.scoreboardText}>
                      {`${player.score} ${player.score == 1 ? 'ponto' : 'pontos'}`}
                    </Text>
                  </View>
                )
              })
          }
        </View>
      </View>
    )
  }

  startNewRound() {
    // Host restarts the round
    if (this.props.room.currentRoom.created_by == this.props.user.id) {
      console.log('Restarting in 5')

      setTimeout(() => this.props.socket.emit('new_round_start', {
        room: this.props.room.currentRoom.code
      }), 5000)
    }
  }

  renderGameEnd() {
    const winner = this.props.room.currentRoom.game.game_winner

    return (
      <View
        style={styles.container}>
        <Text
          style={styles.winnerText}>
          {`${winner.source == 'fb' ? winner.name.split(' ')[0] : winner.username} venceu o jogo!`}
        </Text>

        <View
          style={styles.scoreboard}>
          {
            this.props.room.currentRoom.game.players
              .slice()
              .sort((a, b) => {
                return b.score - a.score
              })
              .map((player, i) => {
                return (
                  <View style={styles.scoreboardItem}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <PlayerPreview
                        fontSize={14}
                        height={heightPercentageToDP(4)}
                        width={heightPercentageToDP(4)}
                        player={player.data} />

                      <View
                        style={{ marginLeft: widthPercentageToDP(2), backgroundColor: '#FFF', justifyContent: 'center', flex: 1, borderRadius: widthPercentageToDP(5) }}>
                        <Text style={{ color: '#000', textAlign: 'center' }}>
                          {player.data.source == 'fb' ? player.data.name.split(' ')[0] : player.data.username}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.scoreboardText}>
                      {`${player.score} ${player.score == 1 ? 'ponto' : 'pontos'}`}
                    </Text>
                  </View>
                )
              })
          }
        </View>
      </View>
    )
  }

  render() {
    if (this.props.room.currentRoom.game) {
      switch (this.props.room.currentRoom.game.state) {
        case 'Selecting':
          return this.renderSelecting()

        case 'Voting':
          return this.renderVoting()

        case 'Results':
          this.startNewRound()
          return this.renderResults()

        case 'End':
          return this.renderGameEnd()
      }
    }

    else return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: heightPercentageToDP(2)
  },

  userList: {
    flexDirection: 'row',
    alignItems: 'center',
    height: heightPercentageToDP("10%"),
    paddingHorizontal: 12
  },

  handContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },

  czarInfoText: {
    textAlign: 'center',
    color: '#FFF'
  },

  voteButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
  },

  voteButton: {
    padding: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(100),
    marginHorizontal: widthPercentageToDP(10)
  },

  winnerText: {
    color: '#FFF',
    fontSize: widthPercentageToDP(5),
    marginVertical: heightPercentageToDP(2)
  },

  scoreboard: {
    flex: 1,
    marginBottom: heightPercentageToDP(5),
    alignSelf: 'stretch',
    borderRadius: widthPercentageToDP(4),
    marginHorizontal: widthPercentageToDP(15),
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(5),
    backgroundColor: '#0f0f0f'
  },

  scoreboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: heightPercentageToDP(1)
  },

  scoreboardText: {
    color: '#FFF',
    width: widthPercentageToDP(20),
    paddingLeft: widthPercentageToDP(2)
  }
})
