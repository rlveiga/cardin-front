import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import PlayerPreview from '../components/PlayerPreview';

@inject('user')
@inject('room')
@inject('collection')
@observer
export default class Home extends Component {
  logout() {
    // LoginManager.logOut()

    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>
          <View
            style={styles.profileContainer}>
            <PlayerPreview
              player={this.props.user} />

            <Text style={styles.greeter}>
              👋 Olá, {
                this.props.user.source == 'fb' ?
                  this.props.user.name.split(' ')[0] :
                  this.props.user.username
              }
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', paddingTop: heightPercentageToDP(15) }}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.cardButton, { backgroundColor: '#FFF' }]}
                onPress={() => this.props.navigation.navigate('SelectCollection')}>
                <Text style={[styles.cardButtonText, { color: '#000' }]}>
                  Criar sala
              </Text>

                <Text style={[styles.cardButtonDescription, { color: '#000' }]}>
                  Crie uma nova sala e chame seus amigos
              </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cardButton, { backgroundColor: '#000', borderWidth: 1, borderColor: '#FFF' }]}
                onPress={() => this.props.navigation.navigate('JoinRoom')}>
                <Text style={[styles.cardButtonText, { color: '#FFF' }]}>
                  Buscar sala
              </Text>

                <Text style={[styles.cardButtonDescription, { color: '#FFF' }]}>
                  Encontre amigos ou jogue online com desconhecidos
              </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <TouchableOpacity
          onPress={() => this.logout()}
          style={styles.logoutButton}>
          <Text
            style={styles.logoutButtonText}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignSelf: 'stretch',
    alignItems: 'center'
  },

  profileContainer: {
    paddingVertical: heightPercentageToDP(2),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#1F1F1F',
    alignSelf: 'stretch'
  },

  greeter: {
    color: '#FFF',
    fontSize: 26,
    marginTop: heightPercentageToDP(1)
  },

  buttonsContainer: {
    flexDirection: 'row',
  },

  cardButton: {
    width: widthPercentageToDP("40%"),
    height: heightPercentageToDP("22%"),
    marginHorizontal: 12,
    borderRadius: 8,
    paddingHorizontal: widthPercentageToDP("2%"),
    paddingVertical: heightPercentageToDP("1%")
  },

  cardButtonText: {
    fontSize: heightPercentageToDP(3),
    fontWeight: 'bold'
  },

  cardButtonDescription: {
    fontSize: heightPercentageToDP(2),
    marginTop: heightPercentageToDP("2%")
  },

  searchInput: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingBottom: 12
  },

  createText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16
  },

  searchButton: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 12,
    backgroundColor: '#A2A2A2',
    opacity: 0.5,
    position: 'absolute',
    right: 0
  },

  logoutButton: {
    backgroundColor: '#A2A2A2',
    paddingHorizontal: widthPercentageToDP(3),
    paddingVertical: heightPercentageToDP(0.5),
    borderRadius: 10,
    bottom: heightPercentageToDP(2)
  },

  logoutButtonText: {
    color: '#000',
  }
})
