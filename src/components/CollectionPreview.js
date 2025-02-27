import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default class CollectionPreview extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[styles.collectionContainer, { opacity: this.props.disabled ? 0.3 : 1, height: this.props.height, width: this.props.width }]}>
        <Text numberOfLines={2} style={{ fontSize: this.props.fontSize, fontWeight: 'bold', color: '#FFF' }}>
          {this.props.collection.name}
        </Text>

        <View style={{ flex: 1 }} />

        {
          this.props.editModeOn && this.props.collection.editable ?
            <TouchableOpacity
            onPress={() => this.props.removeCollection(this.props.collection)}
            style={styles.removeBtn}>
              <Text style={{color: '#FFF', textAlign: 'center'}}>
                Remover
              </Text>
            </TouchableOpacity>
            :
            <View
              style={styles.bottomCounter}>
              <Text style={{ fontSize: this.props.cardCountFontSize, color: '#FFF' }}>
                {`${this.props.collection.white_card_count}`}
              </Text>

              <View style={[styles.tinyCard, { backgroundColor: '#FFF' }]} />

              <Text style={{ fontSize: this.props.cardCountFontSize, color: '#FFF' }}>
                {`${this.props.collection.black_card_count}`}
              </Text>

              <View style={[styles.tinyCard, { backgroundColor: '#000', borderWidth: 1, borderColor: '#FFF' }]} />
            </View>
        }
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
    paddingTop: 12,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 6
  },

  removeBtn: {
    backgroundColor: 'red',
    opacity: 0.75,
    paddingHorizontal: widthPercentageToDP(2),
    paddingVertical: widthPercentageToDP(1),
    marginBottom: heightPercentageToDP(1),
    marginHorizontal: widthPercentageToDP(1),
    borderRadius: 4
  },

  bottomCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentageToDP(1)
  },

  tinyCard: {
    marginHorizontal: widthPercentageToDP(1),
    height: heightPercentageToDP(1.8),
    width: widthPercentageToDP(2.5),
    borderRadius: widthPercentageToDP(0.5)
  }
})
