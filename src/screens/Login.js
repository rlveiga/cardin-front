import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { observer, inject } from 'mobx-react'

@inject('user')
@observer
export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.onButtonPress = this.onButtonPress.bind(this);
    }

    async onButtonPress() {
        await this.props.user.login(
            this.state.email,
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
                placeholder='E-mail'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.email}
                onChangeText={(val) => this.setState({email: val})}/>
                <TextInput 
                secureTextEntry={true}
                style={[styles.textInputContainer, {marginBottom: 64}]}
                placeholder='Senha'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.password}
                onChangeText={(val) => this.setState({password: val})}/>

                <TouchableOpacity
                onPress={() => this.onButtonPress()}
                style={styles.button}>
                    <Text style={{color: '#FFF'}}>Entrar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25
    },

    textInputContainer: {
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'grey',
        paddingBottom: 12, 
        paddingTop: 12,
        paddingLeft: 25,
        fontSize: 18
    },

    button: {
        backgroundColor: '#000',
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch'
    }
})