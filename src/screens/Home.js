import React, { Component } from 'react'
import { Alert, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Dialog from "react-native-dialog";
import { inject, observer } from 'mobx-react';

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
            <View>
                <Text>Hi, {this.props.user.name}</Text>
                
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>{this.state.dialogTitle}</Dialog.Title>
                    <Dialog.Description>{this.state.dialogDescription}</Dialog.Description>

                    <Dialog.Input onChangeText={(val) => this.setState({newRoomName: val})}/>

                    <Dialog.Button bold={true} label='Confirmar' onPress={() => {
                        this.setState({dialogVisible: false, dialogTitle: '', dialogDescription: ''})

                        if(this.state.dialogTitle == 'Criar sala')
                            this.createRoom(this.state.newRoomName)
                        
                        else if(this.state.dialogTitle == 'Buscar sala')
                            this.joinRoom(this.state.newRoomName)
                    }}/>
                    <Dialog.Button label='Cancelar' onPress={() => {this.setState({dialogVisible: false})}}/>
                </Dialog.Container>

                <TouchableOpacity
                onPress={() => this.onButtonPress('create')}>
                    <Text>Criar sala</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => this.onButtonPress('join')}>
                    <Text>Buscar sala</Text>    
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
