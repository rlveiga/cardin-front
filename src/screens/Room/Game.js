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
        created_by: card.created_by
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
      room: this.props.room.currentRoom.data.code,
      user_id: this.props.user.id,
      cards: this.state.cardsSelected
    })

    this.setState({ cardsSelected: [], cardsSelectedCount: 0 })
  }

  confirmWinner(winner_id) {
    console.log(winner_id)

    this.props.socket.emit('pick_winner', {
      room: this.props.room.currentRoom.data.code,
      winner_id: winner_id
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
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

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
            height={heightPercentageToDP(40)}
            width={heightPercentageToDP(25)}
            card={this.props.room.currentRoom.game.table_card} />

          {
            !this.isCzar() ?
              <TouchableOpacity
                onPress={() => this.confirmSelectedCards()}>
                <Text style={{ color: '#FFF' }}>Jogar</Text>
              </TouchableOpacity> :
              null
          }

          <View
            style={{ flex: 1 }} />

          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.handContainer}>
            {this.renderHandCards()}
          </ScrollView>
        </View>
      </View> :
      null
  }

  renderCard = ({ item, index }) => {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity
          disabled={this.props.room.currentRoom.game.czar_id !== this.props.user.id}
          onPress={() => this.confirmWinner(item.user.id)}
          style={{ alignSelf: 'center' }}>
          {
            item.cards.length == 1 ?
              <CardPreview
                fontSize={heightPercentageToDP(4)}
                width={widthPercentageToDP(65)}
                height={heightPercentageToDP(50)}
                card={item.cards[0]} /> :
              item.cards.map((card, i) => {
                return (
                  <View
                    style={{ alignItems: 'center' }}>
                    <CardPreview
                      style={{
                        top: i % 2 == 0 ? heightPercentageToDP(25) : 0,
                        shadowOpacity: 0.8,
                        elevation: 2,
                        shadowRadius: heightPercentageToDP(5),
                        shadowOffset: { width: 0, height: heightPercentageToDP(5) }
                      }}
                      fontSize={heightPercentageToDP(4)}
                      width={i % 2 == 0 ? widthPercentageToDP(60) : widthPercentageToDP(65)}
                      height={heightPercentageToDP(50)}
                      card={card} />
                  </View>
                )
              })
          }
        </TouchableOpacity>
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
    return (
      <View
        style={styles.container}>
        <Text
          style={styles.winnerText}>
          {`${this.props.room.currentRoom.game.round_winner.username} venceu a rodada!`}
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
                  <View
                    style={styles.scoreboardItem}>
                    <Text
                      style={styles.scoreboardText}>{`${player.data.username} ${player.score}`}
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
    if (this.props.room.currentRoom.data.created_by == this.props.user.id) {
      console.log('Restarting in 5')

      setTimeout(() => this.props.socket.emit('new_round_start', {
        room: this.props.room.currentRoom.data.code
      }), 5000)
    }
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

  winnerText: {
    color: '#FFF',
    fontSize: widthPercentageToDP(5),
    marginBottom: heightPercentageToDP(2)
  },

  scoreboard: {
    alignSelf: 'stretch',
    borderRadius: widthPercentageToDP(4),
    height: heightPercentageToDP(50),
    marginHorizontal: widthPercentageToDP(15),
    backgroundColor: '#FFF'
  },

  scoreboardItem: {
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(3),
    borderBottomWidth: 1,
    borderColor: '#DFDFDF',
    flexDirection: 'row'
  }
})
