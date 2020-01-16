import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { observer, inject } from 'mobx-react'

@inject('user')
@observer
export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.onButtonPress = this.onButtonPress.bind(this);
    }

    async onButtonPress() {
        await this.props.user.login(
            this.state.username,
            this.state.password
        );

        if(this.props.user.success) {
            this.props.navigation.navigate('Home')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput 
                style={[styles.textInputContainer, {marginBottom: 42}]}
                placeholder='Nome de usuário'
                placeholderTextColor='#A2A2A2'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.username}
                onChangeText={(val) => this.setState({username: val})}/>
                <TextInput 
                secureTextEntry={true}
                style={[styles.textInputContainer, {marginBottom: 64}]}
                placeholder='Senha'
                placeholderTextColor='#A2A2A2'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.password}
                onChangeText={(val) => this.setState({password: val})}/>

                <TouchableOpacity
                onPress={() => this.onButtonPress()}
                style={styles.button}>
                    <Text style={{color: '#000'}}>Entrar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25
    },

    textInputContainer: {
        alignSelf: 'stretch',
        color: '#FFF',
        borderBottomWidth: 1,
        borderColor: 'grey',
        paddingBottom: 12, 
        paddingTop: 12,
        paddingLeft: 25,
        fontSize: 18
    },

    button: {
        backgroundColor: '#FFF',
        borderRadius: 6,
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch'
    }
})