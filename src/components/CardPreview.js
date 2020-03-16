import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen';

export default class CardPreview extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const textColor = (this.props.card.card_type == 'black' ? 'white' : 'black')
    const borderColor = (this.props.card.card_type == 'black' ? 'white' : null)
    const backgroundColor = this.props.card.card_type

    const combinedStyles = StyleSheet.flatten([
      styles.cardContainer(this.props.height, this.props.width), { borderColor: borderColor, borderWidth: this.props.card.card_type == 'black' ? 2 : null, backgroundColor: backgroundColor },
      this.props.style
    ])

    return (
      <View style={combinedStyles}>
        <Text style={styles.cardText(this.props.fontSize, textColor)}>
          {this.props.card.name}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: (height = 180, width = widthPercentageToDP("30%")) => {
    return {
      margin: 6,
      paddingTop: 12,
      paddingLeft: 8,
      paddingRight: 4,
      borderRadius: 6,
      height: height,
      width: width
    }
  },

  cardText: (fontSize = 14, textColor) => {
    return {
      fontSize: fontSize,
      color: textColor
    }
  }
})
