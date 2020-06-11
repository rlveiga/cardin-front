import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Switch, Alert, ScrollView, Platform } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { inject, observer } from 'mobx-react'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'
import AsyncLoader from './AsyncLoader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class CardCreator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collectionName: '',
      cardCreatorCount: 1,
      cardCreators: [
        {
          switch: true,
          text: '',
          slots: 0
        }
      ],
      loading: false
    }
  }

  getCardCreators() {
    return this.state.cardCreators
  }

  renderCardCreators() {
    return this.state.cardCreators.map((creator, i) => {
      return (
        <View
          key={i}
          style={styles.cardCreator}>
          <TextInput
            maxLength={256}
            ref={`card_input_${i}`}
            returnKeyType='next'
            onSubmitEditing={() => {
              if (this.refs[`card_input_${i + 1}`])
                this.refs[`card_input_${i + 1}`].focus()
            }}
            autoCorrect={false}
            value={creator.text}
            onChangeText={val => this.updateCardCreatorText(val, i)}
            placeholderTextColor='#A2A2A2'
            placeholder='nome da carta'
            style={[styles.cardCreatorInput, {
              backgroundColor: creator.switch ? '#FFF' : '#000',
              color: creator.switch ? '#000' : '#FFF',
              borderColor: '#FFF',
              borderWidth: 2
            }]} />


          <Switch
            value={creator.switch}
            onValueChange={() => this.updateCardCreatorSwitch(i)}
            thumbColor={
              creator.switch ?
                Platform.OS == 'ios' ?
                  "#000" :
                  '#E4E4E4' :
                "#FFF"
            }
            trackColor={{
              false: '#000',
              true: '#FFF',
            }} />
        </View>
      )
    })
  }

  updateCardCreatorText(val, i) {
    let cardCreators = this.state.cardCreators

    // Add new slot, check for length to allow backspace
    if (val[val.length - 1] == '_' && val.length > cardCreators[i].text.length) {
      console.log(cardCreators[i])

      if (cardCreators[i].switch)
        return

      if (cardCreators[i].slots == 2) {
        Alert.alert('Máximo de 2 espaços em branco por carta preta')
        return
      }

      val = `${val}___ `
      cardCreators[i].slots++
    }

    // Remove slot
    if (cardCreators[i].text[cardCreators[i].text.length - 1] == '_' && val.length < cardCreators[i].text.length) {
      cardCreators[i].text = cardCreators[i].text.substring(0, cardCreators[i].text.length - 4)
      cardCreators[i].slots--
    }

    else {
      cardCreators[i].text = val
    }

    this.setState({ cardCreators })
  }

  updateCardCreatorSwitch(i) {
    let cardCreators = this.state.cardCreators

    cardCreators[i].switch = !cardCreators[i].switch

    this.setState({ cardCreators })
  }

  addCardCreator() {
    let cardCreators = this.state.cardCreators

    cardCreators.push({
      switch: true,
      text: '',
      slots: 0
    })

    this.setState({ cardCreators })
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 25 }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          extraScrollHeight={heightPercentageToDP(5)}>
          {this.renderCardCreators()}

          <TouchableOpacity
            onPress={() => this.addCardCreator()}
            style={styles.addCardButton}>
            <Text style={{ fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingTop: 25
  },

  textInput: {
    fontSize: widthPercentageToDP(6),
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#A2A2A2',
    color: '#FFF',
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 4
  },

  cardCreatorContainer: {
    flexGrow: 1
  },

  cardCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },

  cardCreatorInput: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: 'red',
    padding: 12,
    marginRight: 25,
    fontSize: 16
  },

  addCardButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    opacity: 0.9,
    alignSelf: 'center',
    marginBottom: 25
  }
})