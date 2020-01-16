import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationActions } from 'react-navigation';

@inject('user')
@inject('room')
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
            <SafeAreaView style={styles.container}>
                <Text style={styles.greeter}>👋 Hi, {this.props.user.username}</Text>

                <View style={{flex: 1, paddingLeft: 25, paddingRight: 25, alignSelf: 'stretch', justifyContent: 'center'}}>
                    <View style={styles.searchInput}>
                        <TextInput
                        style={{
                            flex: 1,
                            color: '#FFF',
                            fontSize: 22,
                            textAlign: 'center'
                        }}
                        maxLength={5}
                        placeholder='Buscar sala'
                        placeholderTextColor='#A2A2A2'
                        autoCapitalize='characters'
                        autoCorrect={false}>                        
                        </TextInput>

                        <TouchableOpacity style={styles.searchButton}>
                            <Text style={{color: '#000'}}>Go</Text>
                        </TouchableOpacity>
                    </View>

                    

                    <TouchableOpacity
                    style={{paddingLeft: 8, paddingRight: 8, borderRadius: 6, marginTop: 12, alignSelf: 'center', backgroundColor: '#FFF', opacity: 0.8}}
                    onPress={() => this.onButtonPress('create')}>
                        <Text style={styles.createText}>Criar sala</Text>
                    </TouchableOpacity>    

                    <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('CardsCollectionsNavigator', {}, NavigationActions.navigate({routeName: 'Cards'}))}
                    style={{marginTop: 48}}>
                        <Text style={{color: '#FFF', textAlign: 'center'}}>Minhas cartas</Text>    
                    </TouchableOpacity> 
                </View>           
            </SafeAreaView>
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
        fontSize: 26
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
