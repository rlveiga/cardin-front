import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

@inject('card')
@inject('collection')
@observer
export default class CreateCard extends Component {
    constructor(props) {
      super(props)

      this.state = {
        cardName: '',
        cardType: 'black',
        loaded: false
      }
    }

    async createCard() {
      await this.props.card.createCard(
        this.state.cardName,
        this.state.cardType
      )

      if(this.props.card.success) {
        this.props.collection.shouldReloadCollection = true
        this.props.collection.shouldReloadCollections = true
        this.props.navigation.goBack()
      }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{marginTop: 25, flexDirection: 'row'}}>
                    <TouchableOpacity
                    onPress={() => this.setState({cardType: 'black'})}
                    disabled={this.state.cardType == 'black'}
                    style={[styles.optionButton, {backgroundColor: this.state.cardType == 'black' ? 'grey' : '#FFF' , marginRight: 24}]}>
                        <Text>Black</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={() => this.setState({cardType: 'white'})}
                    disabled={this.state.cardType == 'white'}
                    style={[styles.optionButton, {backgroundColor: this.state.cardType == 'white' ? 'grey' : '#FFF'}]}>
                        <Text>White</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.creatorContainer, {backgroundColor: this.state.cardType == 'black' ? '#000' : '#FFF'}]}>
                    <TextInput
                    selectionColor={this.state.cardType == 'black' ? '#FFF' : '#000'}
                    autoCorrect={false}
                    multiline={true}
                    value={this.state.cardName}
                    onChangeText={(val) => this.setState({cardName: val})}
                    style={[styles.textInput, {color: this.state.cardType == 'black' ? '#FFF' : '#000'}]}
                    placeholder='card name'
                    placeholderTextColor='#A1A1A1'/>

                    {/* <TextInput
                    value={this.state.cardType}
                    onChangeText={(val) => this.setState({cardType: val})}
                    style={styles.textInput}
                    placeholder='card type'
                    placeholderTextColor='#A2A2A2'/> */}
                </View>

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
        alignItems: 'center',
        backgroundColor: '#000',
        paddingLeft: 25,
        paddingRight: 25
    },

    creatorContainer: {
        flex: 0.75,
        marginTop: 32,
        alignSelf: 'stretch',
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 12
    },

    textInput: {
        flexWrap: 'wrap',
        fontSize: 32,
        fontWeight: 'bold',
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 18,
        paddingRight: 12,
    },

    optionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 4
    }
})