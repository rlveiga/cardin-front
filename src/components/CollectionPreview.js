import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default class CollectionPreview extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <View style={[styles.collectionContainer, { opacity: this.props.disabled ? 0.3 : 1 }]}>
        <Text numberOfLines={2} style={{ fontSize: 28, fontWeight: 'bold', color: '#FFF' }}>
          {this.props.collection.name}
        </Text>

        <View style={{ flex: 1 }} />

        <View
        style={styles.bottomCounter}>
          <Text style={{ marginBottom: 8, color: '#FFF' }}>
            {`${this.props.collection.white_card_count}`}
          </Text>

          <View style={[styles.tinyCard, {backgroundColor: '#FFF'}]}/>

          <Text style={{ marginBottom: 8, color: '#FFF' }}>
            {`${this.props.collection.black_card_count}`}
          </Text>

          <View style={[styles.tinyCard, {backgroundColor: '#000', borderWidth: 1, borderColor: '#FFF'}]}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  collectionContainer: {
    margin: 6,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#FFF',
    opacity: 0.8,
    paddingTop: 12,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 6,
    width: widthPercentageToDP(35),
    height: 245
  },

  bottomCounter: {
    flexDirection: 'row'
  },

  tinyCard: {
    marginHorizontal: widthPercentageToDP(1),
    height: heightPercentageToDP(1.8),
    width: widthPercentageToDP(2.5),
    borderRadius: widthPercentageToDP(0.5)
  }
})
