import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { inject, observer } from 'mobx-react';
import PlayerPreview from './PlayerPreview';

@inject('room')
@inject('user')
@observer
export default class PlayersList extends Component {
  renderPlayers() {
    return this.props.room.currentRoom.game && this.props.room.playersList ?
      this.props.room.playersList
        .slice()
        .sort((a, b) => {
          return b.score - a.score
        })
        .map((player, i) => {
          const isVoter = this.props.room.currentRoom.game.czar_id == player.data.id

          return (
            <View
              style={{
                alignItems: 'center',
                marginHorizontal: 6,
              }}
              key={i}>
              {
                player.data.source == 'fb' ?
                  <Image
                    style={{
                      height: heightPercentageToDP(8),
                      width: heightPercentageToDP(8),
                      borderRadius: heightPercentageToDP("4%"),
                    }}
                    source={{
                      uri: player.data.profile_img
                    }} /> :
                  <PlayerPreview
                    fontSize={28}
                    player={player.data}
                    score={player.score} />
              }

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
                <Text style={{ color: isVoter ? '#FFF' : '#000', textAlign: 'center' }}>
                  {
                    player.data.source == 'fb' ?
                      player.data.name.split(' ')[0] :
                      player.data.username
                  }
                </Text>
              </View>
            </View>
          )
        }) :
      this.props.room.currentRoom.users.map((player, i) => {
        return (
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 6,
              opacity: 1
            }}
            key={i}>
            {
              player.source == 'fb' ?
                <Image
                  style={{
                    height: heightPercentageToDP(8),
                    width: heightPercentageToDP(8),
                    borderRadius: heightPercentageToDP("4%"),
                  }}
                  source={{
                    uri: player.profile_img
                  }} /> :
                <PlayerPreview
                  fontSize={28}
                  player={player} />
            }
            <View
              style={{
                backgroundColor: '#FFF',
                borderRadius: heightPercentageToDP("4%"),
                borderWidth: 0,
                borderColor: '#FFF',
                justifyContent: 'center',
                paddingHorizontal: widthPercentageToDP(2),
                paddingVertical: widthPercentageToDP(1),
                marginTop: heightPercentageToDP(1)
              }}>
              <Text style={{ color: '#000', textAlign: 'center' }}>
                {
                  player.source == 'fb' ?
                    player.name.split(' ')[0] :
                    player.username
                }
              </Text>
            </View>
          </View>
        )
      })
  }

  render() {
    return (
      <View
        style={styles.container}>
        <ScrollView
        horizontal={true}>
          {this.renderPlayers()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: heightPercentageToDP(15)
  }
})