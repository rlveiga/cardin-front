import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default class ErrorText extends Component {
  render() {
    const textAlign = this.props.textAlign ? this.props.textAlign : 'center';

    if (this.props.show) {
      return (
        <Text
          style={{
            textAlign,
            color: 'red',
            fontSize: 12,
            marginTop: heightPercentageToDP(1),
            height: heightPercentageToDP(2)
          }}>
          {this.props.text}
        </Text>
      );
    }
    return null;
  }
}