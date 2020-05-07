import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

export default class PlayerPreview extends Component {
  render() {
    const { player, height, width, fontSize } = this.props
    
    return (
      <View>
        {
          player.source == 'fb' ?
            <Image
              style={{
                height: height || heightPercentageToDP(8),
                width: width || heightPercentageToDP(8),
                borderRadius: heightPercentageToDP("4%"),
              }}
              source={{
                uri: player.profile_img
              }} /> :
            <View
              style={{
                backgroundColor: player.profile_color,
                borderWidth: 2,
                borderColor: '#FFF',
                justifyContent: 'center',
                height: height || heightPercentageToDP(8),
                width: width || heightPercentageToDP(8),
                borderRadius: height / 2 || heightPercentageToDP(4),
              }}>
              <Text
                style={{ color: '#FFF', fontSize: fontSize || 22, textAlign: 'center' }}>
                {player.username[0].toUpperCase()}
              </Text>
            </View>
        }
      </View>
    )
  }
}
