import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

@inject('user')
@inject('room')
@inject('collection')
@observer
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogVisible: false,
            dialogTitle: '',
            dialogDescription: '',
            newRoomName: ''            
        }
    }

    onButtonPress(which) {
        if(which == 'create') {
            this.setState({
                dialogVisible: true,
                dialogTitle: 'Criar sala',
                dialogDescription: 'Digite o nome da sala a ser criada'
            });
        }

        else if(which == 'join') {
            this.setState({
                dialogVisible: true,
                dialogTitle: 'Buscar sala',
                dialogDescription: 'Digite o nome da sala desejada'
            });
        }

        else return
    }

    async createRoom(name) {
        console.log(name)
    }

    async joinRoom(name) {
        await this.props.room.joinRoom(name)
    }

    render() {
        return (
          <View style={styles.container}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.greeter}>👋 Olá, {this.props.user.username}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                style={[styles.cardButton, {backgroundColor: '#000', borderWidth: 1, borderColor: '#FFF'}]}>
                  <Text style={[styles.cardButtonText, {color: '#FFF'}]}>Buscar sala</Text>

                  <Text style={[styles.cardButtonDescription, {color: '#FFF'}]}>Encontre amigos ou jogue online com desconhecidos</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                style={[styles.cardButton, {backgroundColor: '#FFF'}]}
                onPress={() => this.props.navigation.navigate('CreateRoom')}>
                  <Text style={[styles.cardButtonText, {color: '#000'}]}>Criar sala</Text>

                  <Text style={[styles.cardButtonDescription, {color: '#000'}]}>Crie uma nova sala e chame seus amigos</Text>
                </TouchableOpacity>
              </View>
            </View>   
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

    greeter: {
        color: '#FFF',
        fontSize: 26,
        marginBottom: heightPercentageToDP("3%")
    },

    buttonsContainer: {
      flexDirection: 'row',
    },

    cardButton: {
      width: widthPercentageToDP("40%"),
      height: heightPercentageToDP("22%"),
      marginHorizontal: 12,
      borderRadius: 8,
      paddingLeft: widthPercentageToDP("3%"),
      paddingTop: heightPercentageToDP("2%")
    },

    cardButtonText: {
      fontSize: 24,
      fontWeight: 'bold'
    },

    cardButtonDescription: {
      fontSize: 14,
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
    }
})
