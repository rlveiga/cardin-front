import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { inject, observer } from 'mobx-react'

@inject('room')
@observer
export default class Room extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.code
    }
  }

  renderUsers() {
    return this.props.room.currentRoom.users.map((user, i) => {
      return (
        <View
          style={{
            backgroundColor: '#FFF',
            height: heightPercentageToDP("8%"),
            width: heightPercentageToDP("8%"),
            borderRadius: heightPercentageToDP("4%"),
            justifyContent: 'center',
          }}>
          <Text style={{color: '#000', textAlign: 'center'}}>{user.username}</Text>
        </View>
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userList}>
          {this.renderUsers()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },

  userList: {
    flexDirection: 'row',
    alignItems: 'center',
    height: heightPercentageToDP("10%"),
    paddingHorizontal: 12
  }
})
