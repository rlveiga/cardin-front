import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'

@inject('card')
@observer
export default class CreateCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cardName: '',
            cardType: '',
            loaded: false
        }
    }

    async createCard() {
        await this.props.card.createCard(
            this.state.cardName,
            this.state.cardType
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                value={this.state.cardName}
                onChangeText={(val) => this.setState({cardName: val})}
                style={styles.textInput}
                placeholder='card name'
                placeholderTextColor='#A2A2A2'/>

                <TextInput
                value={this.state.cardType}
                onChangeText={(val) => this.setState({cardType: val})}
                style={[styles.textInput, {marginTop: 12}]}
                placeholder='card type'
                placeholderTextColor='#A2A2A2'/>

                <TouchableOpacity
                style={{marginTop: 32}}
                onPress={() => this.createCard()}>
                    <Text style={{color: '#FFF', textAlign: 'center'}}>Create</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingLeft: 25,
        paddingRight: 25
    },

    textInput: {
        color: '#FFF',
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'grey',
        paddingBottom: 12
    },
})