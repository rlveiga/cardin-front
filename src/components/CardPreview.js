import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CardPreview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedForEdit: false
    }
  }

  toggleEdit = () => {
    if(!this.state.selectedForEdit)
      this.props.addCardToSelectedList()

    else
      this.props.removeCardFromSelectedList()

    this.setState({ selectedForEdit: !this.state.selectedForEdit })
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
      <TouchableOpacity
        onPress={!this.props.editModeOn ? this.props.onPress : this.toggleEdit}
        style={[combinedStyles, {
          opacity: this.props.disabled ? 0.3 : 1
        }]}>
        <Text style={styles.cardText(this.props.fontSize, textColor)}>
          {this.props.card.name}
        </Text>

        {
          this.props.editModeOn ?
            this.state.selectedForEdit ?
              <View
                style={styles.editCheck}>
                <Icon name='check' color='#FFF' size={widthPercentageToDP(3)} />
              </View> :
              null :
            null
        }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: (height = widthPercentageToDP(45), width = widthPercentageToDP(30)) => {
    return {
      margin: widthPercentageToDP(1),
      paddingTop: 12,
      paddingLeft: 8,
      paddingRight: 4,
      borderRadius: height / 35,
      height: height,
      width: width
    }
  },

  cardText: (fontSize = 14, textColor) => {
    return {
      fontSize: fontSize,
      color: textColor
    }
  },

  editCheck: {
    position: 'absolute',
    right: widthPercentageToDP(4),
    top: widthPercentageToDP(4),
    width: widthPercentageToDP(6),
    height: widthPercentageToDP(6),
    borderRadius: widthPercentageToDP(3),
    backgroundColor: '#1C7FF5',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
