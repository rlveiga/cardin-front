import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP } from 'react-native-responsive-screen';

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
          <KeyboardAwareScrollView
          keyboardShouldPersistTaps={false}
          extraScrollHeight={heightPercentageToDP("7%")}
          bounces={false}
          contentContainerStyle={styles.container}>
            <Text
            style={styles.title}>
              Cardin
            </Text>

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
          </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25,
    },

    title: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: heightPercentageToDP("8%")
    },

    textInputContainer: {
        alignSelf: 'stretch',
        color: '#FFF',
        borderBottomWidth: 1,
        borderColor: 'grey',
        paddingBottom: 12, 
        paddingTop: 12,
        paddingLeft: 25,
        fontSize: 18,
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