import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { inject, observer } from 'mobx-react';

@inject('room')
@inject('user')
@observer
export default class PlayersList extends Component {
  renderPlayers() {
    return this.props.room.currentRoom.game ?
      this.props.room.currentRoom.game.players.map((player, i) => {
        const isVoter = this.props.room.currentRoom.game.czar_id == player.data.id

        return (
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 6,
              opacity: player.is_ready ? 0.3 : 1
            }}
            key={i}>
            <Image
              style={{
                height: heightPercentageToDP(8),
                width: heightPercentageToDP(8),
                borderRadius: heightPercentageToDP("4%"),
              }}
              source={{
                uri: player.data.profile_img
              }} />

            <View
              style={{
                backgroundColor: isVoter ? '#000' : '#FFF',
                borderRadius: heightPercentageToDP(4),
                borderWidth: isVoter ? 2 : 0,
                borderColor: '#FFF',
                justifyContent: 'center',
                marginTop: heightPercentageToDP(1),
                paddingHorizontal: widthPercentageToDP(1)
              }}>
              <Text style={{ color: isVoter ? '#FFF' : '#000', textAlign: 'center' }}>{player.data.name.split(' ')[0]}</Text>
            </View>
          </View>
        )
      }) :
      this.props.room.currentRoom.data.users.map((player, i) => {
        return (
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 6,
              opacity: 1
            }}
            key={i}>
            <Image
              style={{
                height: heightPercentageToDP(8),
                width: heightPercentageToDP(8),
                borderRadius: heightPercentageToDP("4%"),
              }}
              source={{
                uri: player.profile_img
              }} />
            <View
              style={{
                backgroundColor: '#FFF',
                borderRadius: heightPercentageToDP("4%"),
                borderWidth: 0,
                borderColor: '#FFF',
                justifyContent: 'center',
                paddingHorizontal: widthPercentageToDP(1),
                marginTop: heightPercentageToDP(1)
              }}>
              <Text style={{ color: '#000', textAlign: 'center' }}>{player.name.split(' ')[0]}</Text>
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