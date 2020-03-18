import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CardPreview from '../../components/CardPreview';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import PlayersList from '../../components/PlayersList';

@inject('user')
@inject('room')
@observer
export default class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      handLoaded: false,
      hand: null,
      isVoter: (this.props.room.gameData.czar_id == this.props.user.id)
    }
  }

  componentDidMount() {
    console.log(this.props.room.gameData.czar_id)
    console.log(this.props.user.id)
  }

  renderHandCards() {
    if (this.props.room.hand) {
      return this.props.room.hand[0].cards.map((card, i) => {
        return (
          <TouchableOpacity
            disabled={this.state.isVoter}>
            <CardPreview
              disabled={this.state.isVoter}
              style={{ marginBottom: 0 }}
              key={i}
              card={card} />
          </TouchableOpacity>
        )
      })
    }

    else return null
  }

  render() {
    return (
      <View
        style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          {
            this.state.isVoter ?
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
            card={this.props.room.gameData.table_card} />

          <View
            style={{ flex: 1 }} />

          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.handContainer}>
            {this.renderHandCards()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignSelf: 'stretch',
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
  }
})
