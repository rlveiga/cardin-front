import React, { Component } from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
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
                style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize || 22, textAlign: 'center' }}>
                {player.username[0].toUpperCase()}
              </Text>
              {
                this.props.score >= 0 ?
                  <View style={styles.scoreContainer}>
                    <Text style={{ textAlign: 'center', color: '#000' }}>
                      {this.props.score}
                    </Text>
                  </View> :
                  null
              }
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scoreContainer: {
    position: 'absolute',
    top: -5,
    width: widthPercentageToDP(6),
    height: widthPercentageToDP(6),
    borderRadius: widthPercentageToDP(3),
    justifyContent: 'center',
    backgroundColor: '#ead538'
  }
})
