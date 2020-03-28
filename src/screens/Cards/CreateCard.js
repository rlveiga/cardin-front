import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

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
        this.state.cardType,
        this.props.collection.selectedCollection.id
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
                <View style={{marginTop: heightPercentageToDP(2), flexDirection: 'row'}}>
                    <TouchableOpacity
                    onPress={() => this.setState({cardType: 'black'})}
                    disabled={this.state.cardType == 'black'}
                    style={[styles.optionButton, {backgroundColor: this.state.cardType == 'black' ? 'grey' : '#FFF' , marginRight: widthPercentageToDP(5)}]}>
                        <Text style={styles.optionButtonText}>Preta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={() => this.setState({cardType: 'white'})}
                    disabled={this.state.cardType == 'white'}
                    style={[styles.optionButton, {backgroundColor: this.state.cardType == 'white' ? 'grey' : '#FFF'}]}>
                        <Text style={styles.optionButtonText}>Branca</Text>
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
                    placeholder='nome da carta'
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
                    <Text style={{color: '#FFF', textAlign: 'center'}}>Criar</Text>
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
        flex: 0.95,
        marginTop: heightPercentageToDP(4),
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
        paddingHorizontal: widthPercentageToDP(4),
        paddingVertical: widthPercentageToDP(2),
        borderRadius: 4
    },

    optionButtonText: {
      fontSize: widthPercentageToDP(4)
    }
})