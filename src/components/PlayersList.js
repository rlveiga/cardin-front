import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { inject, observer } from 'mobx-react';

@inject('room')
@inject('user')
@observer
export default class PlayersList extends Component {
  renderPlayers() {
    return this.props.room.currentRoom.game.players.map((player, i) => {
      const isVoter = this.props.room.currentRoom.game.czar_id == player.data.id
      return (
        <View>
          <View
            key={i}
            style={{
              backgroundColor: isVoter ? '#000' : '#FFF',
              borderRadius: heightPercentageToDP("4%"),
              borderWidth: isVoter ? 2 : 0,
              borderColor: '#FFF',
              justifyContent: 'center',
              marginHorizontal: 6,
              paddingHorizontal: widthPercentageToDP(3),
              paddingVertical: heightPercentageToDP(1), 
              opacity: player.is_ready ? 0.3 : 1
            }}>
            <Text style={{ color: isVoter ? '#FFF' : '#000', textAlign: 'center' }}>{player.data.username}</Text>
          </View>
        </View>
      )
    })
  }

  render() {
    return (
      <View
        style={styles.container}>
        {this.renderPlayers()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12
  }
})