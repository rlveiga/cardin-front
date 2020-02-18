import React, { Component } from 'react'
import { View, StyleSheet, Text, Alert } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { inject, observer } from 'mobx-react'
import {HeaderBackButton} from 'react-navigation-stack';

@inject('room')
@observer
export default class Room extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state

    return {
      headerLeft: (
        <HeaderBackButton
          tintColor='#FFF'
          onPress={() => params.onBack()}
        />
      ),
      title: params.code
    }
  }

  constructor(props) {
    super(props)

    this._onBack = this._onBack.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({onBack: this._onBack})
  }

  async componentWillUnmount() {
    await this.props.room.leaveRoom()
  }

  _onBack() {
    Alert.alert(
      'Tem certeza que deseja sair desta sala?',
      null,
      [
        {text: 'Sair', style: 'destructive', onPress: () => this.props.navigation.goBack()},
        {text: 'Continuar'}
      ]
    )
  }

  renderUsers() {
    return this.props.room.currentRoom.users.map((user, i) => {
      return (
        <View
          key={i}
          style={{
            backgroundColor: '#FFF',
            height: heightPercentageToDP("8%"),
            width: heightPercentageToDP("8%"),
            borderRadius: heightPercentageToDP("4%"),
            justifyContent: 'center',
            marginHorizontal: 6
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
