import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import CardPreview from '../../components/CardPreview';

@inject('user')
@inject('room')
@inject('collection')
@observer
export default class RoomLobby extends Component {
  render() {
    <View style={styles.container}>
      <CardPreview
        card={this.props.room.gameData.table_card} />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#000'
  },

  startGameButton: {
    position: 'absolute',
    bottom: heightPercentageToDP(2),
    alignSelf: 'center',
    backgroundColor: '#A2A2A2',
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4
  }
})
