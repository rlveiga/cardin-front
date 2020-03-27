import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { inject, observer } from 'mobx-react';

@inject('room')
@observer
export default class PlayersList extends Component {
  renderPlayers() {
    return this.props.room.currentRoom.game.players.map((player, i) => {
      return (
        <View>
          <View
            key={i}
            style={{
              backgroundColor: '#FFF',
              height: heightPercentageToDP("8%"),
              width: heightPercentageToDP("8%"),
              borderRadius: heightPercentageToDP("4%"),
              justifyContent: 'center',
              marginHorizontal: 6,
              opacity: player.is_ready ? 0.3 : 1
            }}>
            <Text style={{ color: '#000', textAlign: 'center' }}>{player.data.username}</Text>
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