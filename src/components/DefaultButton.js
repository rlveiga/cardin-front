import React, { Component } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export default class DefaultButton extends Component {
  render() {
    const combinedStyles = StyleSheet.flatten([styles.buttonContainer, this.props.style]);

    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        onPress={this.props.onPress}
        style={[combinedStyles, {opacity: this.props.disabled ? 0.5 : 1}]}>
        <Text style={[styles.buttonText, {color: this.props.textColor || '#000'}]}>{this.props.label}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },

  buttonText: {
  }
})
